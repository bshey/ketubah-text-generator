// Simple test endpoint to verify API routes work
export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
        ok: true,
        message: 'API is working',
        hasApiKey: !!process.env.GEMINI_API_KEY,
        method: req.method,
        timestamp: new Date().toISOString()
    });
}
