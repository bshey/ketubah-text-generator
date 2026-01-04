import { buildEmailHTML } from './_lib/email-template.js';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, english_text, hebrew_text } = req.body;

        // Validate
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email address is required' });
        }

        if (!english_text || !hebrew_text) {
            return res.status(400).json({ error: 'Ketubah text is required' });
        }

        const couponCode = process.env.STATIC_COUPON_CODE || 'FREETEXT4783';
        const html = buildEmailHTML(english_text, hebrew_text, couponCode);

        // If no email API key, simulate success for development
        if (!process.env.RESEND_API_KEY) {
            console.log('No RESEND_API_KEY configured - simulating email send');
            return res.status(200).json({
                success: true,
                message: 'Email simulated (no API key)',
                email,
                coupon_code: couponCode
            });
        }

        // Send via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: process.env.FROM_EMAIL || 'Maybie & Co. <hello@maybie.co>',
                to: [email],
                bcc: process.env.OWNER_BCC_EMAIL ? [process.env.OWNER_BCC_EMAIL] : [],
                subject: '📜 Your Personalized Ketubah Text',
                html: html,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Resend API error:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }

        const result = await response.json();

        return res.status(200).json({
            success: true,
            message: 'Email sent successfully',
            email,
            coupon_code: couponCode,
            email_id: result.id
        });

    } catch (error) {
        console.error('Send email error:', error);
        return res.status(500).json({ error: error.message || 'Email send failed' });
    }
}
