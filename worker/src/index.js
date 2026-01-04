/**
 * Ketubah API Worker
 * Backend proxy for Gemini API, email sending, and coupon delivery
 */

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
                    // TODO: Implement in Build 3
                    return jsonResponse(
                        { error: 'Not implemented - coming in Build 3' },
                        501,
                        origin,
                        allowedOrigins
                    );

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
                    // TODO: Implement in Build 14
                    return jsonResponse(
                        { error: 'Not implemented - coming in Build 14' },
                        501,
                        origin,
                        allowedOrigins
                    );

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
