import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildGeneratePrompt } from './_lib/prompts.js';

const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
];

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
        const data = req.body;

        // Validate required fields
        if (!data.partner1?.english_name || !data.partner2?.english_name) {
            return res.status(400).json({ error: 'Partner names are required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        let lastError = null;

        for (const modelName of MODELS) {
            try {
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

                if (error.message && (error.message.includes('429') || error.message.includes('QuotaFailure') || error.message.includes('Too Many Requests'))) {
                    continue;
                }
            }
        }

        throw lastError || new Error('All models failed to generate text.');

    } catch (error) {
        console.error('Generate error:', error);
        return res.status(500).json({ error: error.message || 'Generation failed' });
    }
}
