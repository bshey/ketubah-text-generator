import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildGeneratePrompt } from './_lib/prompts.js';

// Text-out models in order of preference
const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite'
];

export default async function handler(req, res) {
    // CORS headers - set immediately
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;

        // Validate required fields
        if (!data || !data.partner1?.english_name || !data.partner2?.english_name) {
            return res.status(400).json({ error: 'Partner names are required' });
        }

        // Check for API key
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY environment variable is not set');
            return res.status(500).json({ error: 'Server configuration error: API key not configured' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        let lastError = null;
        let quotaErrors = 0;

        for (const modelName of MODELS) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.9,
                        maxOutputTokens: 4096,
                        responseMimeType: 'application/json',
                    },
                });

                const chat = model.startChat({
                    history: [
                        {
                            role: 'user',
                            parts: [{ text: SYSTEM_PROMPT }],
                        },
                        {
                            role: 'model',
                            parts: [{ text: 'I understand. I am ready to create beautiful, meaningful Ketubah text adhering to all specified guidelines.' }],
                        },
                    ],
                });

                const prompt = buildGeneratePrompt(data);
                const result = await chat.sendMessage(prompt);
                const response = result.response.text();

                let parsed;
                try {
                    parsed = JSON.parse(response);
                } catch (e) {
                    const jsonMatch = response.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        parsed = JSON.parse(jsonMatch[0]);
                    } else {
                        throw new Error('Failed to parse AI response as JSON');
                    }
                }

                if (!parsed.english_text || !parsed.hebrew_text) {
                    throw new Error('Invalid response: missing required text fields');
                }

                console.log(`Success with model: ${modelName}`);
                return res.status(200).json({
                    session_id: crypto.randomUUID(),
                    version: 1,
                    english_text: parsed.english_text,
                    hebrew_text: parsed.hebrew_text,
                    scribe_message: parsed.scribe_message || 'Your Ketubah is ready!',
                    word_count: {
                        english: parsed.english_text.split(/\s+/).length,
                        hebrew: parsed.hebrew_text.split(/\s+/).length,
                    },
                    model_used: modelName
                });

            } catch (error) {
                console.error(`Model ${modelName} failed:`, error.message);
                lastError = error;

                // Track quota errors
                if (error.message && (
                    error.message.includes('429') ||
                    error.message.includes('QuotaFailure') ||
                    error.message.includes('Too Many Requests') ||
                    error.message.includes('quota')
                )) {
                    quotaErrors++;
                    console.log(`Model ${modelName} quota exceeded. Trying next model... (${quotaErrors}/${MODELS.length} quota errors)`);
                }

                // Always try next model
                continue;
            }
        }

        // Customer-friendly error for quota issues
        if (quotaErrors === MODELS.length) {
            return res.status(503).json({
                error: 'Our service is temporarily busy. Please try again in a few moments.'
            });
        }

        throw lastError || new Error('All models failed to generate text.');

    } catch (error) {
        console.error('Generate error:', error);
        // Generic customer-friendly error
        return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
}
