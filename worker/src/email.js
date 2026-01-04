/**
 * Email Service
 * Handles sending Ketubah text via email using Resend API
 * (Resend is simpler and has better free tier than SendGrid)
 */

/**
 * Build HTML email template for Ketubah text
 */
function buildEmailHTML(englishText, hebrewText, couponCode) {
    return `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Ketubah Text</title>
    <style>
        body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.8;
            color: #1a365d;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7fafc;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #b8860b;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1a365d;
            margin: 0;
        }
        .header p {
            color: #4a5568;
            font-style: italic;
        }
        .section {
            background: white;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #1a365d;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .hebrew {
            direction: rtl;
            text-align: right;
            font-family: 'David Libre', Georgia, serif;
            font-size: 18px;
        }
        .coupon-box {
            background: linear-gradient(135deg, #b8860b 0%, #daa520 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }
        .coupon-box h3 {
            margin: 0 0 10px 0;
        }
        .coupon-code {
            background: white;
            color: #1a365d;
            font-size: 24px;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 4px;
            display: inline-block;
            letter-spacing: 2px;
        }
        .footer {
            text-align: center;
            color: #4a5568;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
        }
        .text-content {
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📜 Your Ketubah Text</h1>
        <p>Created by The Wise Scribe</p>
    </div>

    <div class="section">
        <h2>English Version</h2>
        <div class="text-content">${englishText}</div>
    </div>

    <div class="section hebrew">
        <h2>גרסה עברית</h2>
        <div class="text-content">${hebrewText}</div>
    </div>

    ${couponCode ? `
    <div class="coupon-box">
        <h3>🎁 Special Offer for You</h3>
        <p>Use this code for a discount on your custom Ketubah:</p>
        <div class="coupon-code">${couponCode}</div>
    </div>
    ` : ''}

    <div class="footer">
        <p>Thank you for using our Ketubah Text Generator!</p>
        <p>May your marriage be filled with love, joy, and blessings.</p>
    </div>
</body>
</html>
`;
}

/**
 * Send email using Resend API
 * https://resend.com/docs/api-reference/emails/send-email
 */
export async function sendKetubanEmail(data, env) {
    const { email, english_text, hebrew_text } = data;

    // Validate email
    if (!email || !email.includes('@')) {
        throw new Error('Valid email address is required');
    }

    if (!english_text || !hebrew_text) {
        throw new Error('Ketubah text is required');
    }

    const couponCode = env.STATIC_COUPON_CODE || 'FREETEXT';
    const html = buildEmailHTML(english_text, hebrew_text, couponCode);

    // If no email API key, we'll simulate success for development
    if (!env.RESEND_API_KEY) {
        console.log('No RESEND_API_KEY configured - simulating email send');
        return {
            success: true,
            message: 'Email simulated (no API key)',
            email,
            coupon_code: couponCode
        };
    }

    // Send via Resend API
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: env.FROM_EMAIL || 'Ketubah Generator <ketubah@yourdomain.com>',
            to: [email],
            bcc: env.OWNER_BCC_EMAIL ? [env.OWNER_BCC_EMAIL] : [],
            subject: '📜 Your Personalized Ketubah Text',
            html: html,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Resend API error:', error);
        throw new Error('Failed to send email');
    }

    const result = await response.json();

    return {
        success: true,
        message: 'Email sent successfully',
        email,
        coupon_code: couponCode,
        email_id: result.id
    };
}
