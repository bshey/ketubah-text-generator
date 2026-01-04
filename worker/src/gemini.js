/**
 * Gemini API Client
 * Handles AI text generation for Ketubahs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildGeneratePrompt, buildRefinePrompt } from './prompts.js';

const MODELS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
];

export async function generateKetubah(data, env) {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
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
                        parts: [{ text: 'I understand. I am ready to create beautiful, meaningful Ketubah text adhering to all specified guidelines and the single-paragraph output format.' }],
                    },
                ],
            });

            const prompt = buildGeneratePrompt(data);
            const result = await chat.sendMessage(prompt);
            const response = result.response.text();

            // Parse JSON response
            let parsed;
            try {
                parsed = JSON.parse(response);
            } catch (e) {
                // Try to extract JSON from response if it's wrapped in markdown
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsed = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Failed to parse AI response as JSON');
                }
            }

            // Validate required fields
            if (!parsed.english_text || !parsed.hebrew_text) {
                throw new Error('Invalid response: missing required text fields');
            }

            return {
                session_id: crypto.randomUUID(),
                version: 1,
                english_text: parsed.english_text,
                hebrew_text: parsed.hebrew_text,
                scribe_message: parsed.scribe_message || 'Your Ketubah is ready!',
                word_count: {
                    english: parsed.english_text.split(/\s+/).length,
                    hebrew: parsed.hebrew_text.split(/\s+/).length,
                },
                model_used: modelName // Useful for debugging
            };

        } catch (error) {
            console.error(`Model ${modelName} failed:`, error.message);
            lastError = error;

            // If it's a rate limit error, continue to next model
            if (error.message && (error.message.includes('429') || error.message.includes('QuotaFailure') || error.message.includes('Too Many Requests') || error.message.includes('Resource has been exhausted'))) {
                continue;
            }

            // If it's another type of error (e.g., parsing), throw immediately or maybe still retry? 
            // Better to only retry on availability issues.
            // For now, let's be aggressive and retry on almost anything model-related, but strictly rate limits are the goal.
            // If we are out of models, loop ends and we throw lastError.
        }
    }

    throw lastError || new Error('All models failed to generate text.');
}

export async function refineKetubah(data, env) {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.5, // Lower temperature for more precise edits
                    topP: 0.9,
                    maxOutputTokens: 4096,
                    responseMimeType: 'application/json',
                },
            });

            const prompt = buildRefinePrompt(data);
            const result = await model.generateContent(prompt);
            const response = result.response.text();

            // Parse JSON response
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

            return {
                version: data.current_version + 1,
                english_text: parsed.english_text,
                hebrew_text: parsed.hebrew_text,
                scribe_message: parsed.scribe_message || 'Your changes have been applied.',
                word_count: {
                    english: parsed.english_text.split(/\s+/).length,
                    hebrew: parsed.hebrew_text.split(/\s+/).length,
                },
                model_used: modelName
            };
        } catch (error) {
            console.error(`Refine Model ${modelName} failed:`, error.message);
            lastError = error;
            if (error.message && (error.message.includes('429') || error.message.includes('QuotaFailure') || error.message.includes('Too Many Requests') || error.message.includes('Resource has been exhausted'))) {
                continue;
            }
        }
    }

    throw lastError || new Error('All models failed to refine text.');
}
