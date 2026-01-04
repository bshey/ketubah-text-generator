/**
 * Gemini API Client
 * Handles AI text generation for Ketubahs
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT, buildGeneratePrompt, buildRefinePrompt } from './prompts.js';

export async function generateKetubah(data, env) {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
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
                parts: [{ text: 'I understand. I am The Wise Scribe, ready to help create beautiful Ketubah text. I will always respond with the exact JSON structure specified, generating complete bilingual text without any placeholders.' }],
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
    };
}

export async function refineKetubah(data, env) {
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
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
    };
}
