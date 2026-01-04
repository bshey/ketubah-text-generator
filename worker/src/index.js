/**
 * Ketubah API Worker
 * Backend proxy for Gemini API, email sending, and coupon delivery
 */

import { generateKetubah, refineKetubah } from './gemini.js';
import { sendKetubanEmail } from './email.js';

// CORS handling
function handleCORS(request, env) {
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

    const headers = {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    };

    if (allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return new Response(null, { status: 204, headers });
}

// Create response with CORS headers
function jsonResponse(data, status, origin, allowedOrigins) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (allowedOrigins.includes(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return new Response(JSON.stringify(data), { status, headers });
}

// Validate generate request
function validateGenerateRequest(data) {
    const errors = [];

    if (!data.partner1?.english_name) errors.push('Partner 1 English name is required');
    if (!data.partner2?.english_name) errors.push('Partner 2 English name is required');
    if (!data.style) errors.push('Ketubah style is required');

    const validStyles = ['Orthodox', 'Conservative', 'Reform', 'Secular', 'Interfaith', 'LGBTQ+'];
    if (data.style && !validStyles.includes(data.style)) {
        errors.push(`Style must be one of: ${validStyles.join(', ')}`);
    }

    return errors;
}

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return handleCORS(request, env);
        }

        const url = new URL(request.url);
        const origin = request.headers.get('Origin') || '';
        const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

        try {
            switch (url.pathname) {
                case '/api/health':
                    return jsonResponse(
                        { status: 'ok', timestamp: new Date().toISOString() },
                        200,
                        origin,
                        allowedOrigins
                    );

                case '/api/generate':
                    if (request.method !== 'POST') {
                        return jsonResponse({ error: 'Method not allowed' }, 405, origin, allowedOrigins);
                    }

                    const generateData = await request.json();

                    // Validate request
                    const errors = validateGenerateRequest(generateData);
                    if (errors.length > 0) {
                        return jsonResponse({ error: 'Validation failed', details: errors }, 400, origin, allowedOrigins);
                    }

                    // Check for API key
                    if (!env.GEMINI_API_KEY) {
                        return jsonResponse({ error: 'Gemini API key not configured' }, 500, origin, allowedOrigins);
                    }

                    // Generate Ketubah
                    const result = await generateKetubah(generateData, env);

                    return jsonResponse({ success: true, data: result }, 200, origin, allowedOrigins);

                case '/api/refine':
                    if (request.method !== 'POST') {
                        return jsonResponse({ error: 'Method not allowed' }, 405, origin, allowedOrigins);
                    }
                    // TODO: Implement in Build 12
                    return jsonResponse(
                        { error: 'Not implemented - coming in Build 12' },
                        501,
                        origin,
                        allowedOrigins
                    );

                case '/api/send-text':
                    if (request.method !== 'POST') {
                        return jsonResponse({ error: 'Method not allowed' }, 405, origin, allowedOrigins);
                    }

                    const emailData = await request.json();

                    // Validate request
                    if (!emailData.email) {
                        return jsonResponse({ error: 'Email address is required' }, 400, origin, allowedOrigins);
                    }
                    if (!emailData.english_text || !emailData.hebrew_text) {
                        return jsonResponse({ error: 'Ketubah text is required' }, 400, origin, allowedOrigins);
                    }

                    // Send email
                    const emailResult = await sendKetubanEmail(emailData, env);

                    return jsonResponse({ success: true, data: emailResult }, 200, origin, allowedOrigins);

                default:
                    return jsonResponse({ error: 'Not found' }, 404, origin, allowedOrigins);
            }
        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse(
                { error: 'Internal server error', message: error.message },
                500,
                origin,
                allowedOrigins
            );
        }
    },
};
