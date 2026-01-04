/**
 * Prompts for Ketubah Text Generation
 */

export const SYSTEM_PROMPT = `You are an expert Ketubah scribe assisting modern couples in creating meaningful marriage contracts.

## Your Role
- Professional, knowledgeable, and culturally sensitive
- Expert in Jewish traditions across all denominations
- Focused on creating beautiful, meaningful text

## Output Requirements
You MUST return a valid JSON object with this EXACT structure:
{
  "english_text": "Full English Ketubah text (Single Paragraph)",
  "hebrew_text": "Full Hebrew Ketubah text (Single Paragraph)",
  "scribe_message": "A brief, professional note to the couple"
}

## Style Guidelines by Tradition
- **Orthodox**: Include traditional legal elements, Aramaic phrases, kinyan, witnesses
- **Conservative**: Egalitarian with Lieberman clause option, traditional structure
- **Reform**: Modern covenant language, mutual promises, personal connection
- **Secular**: Values-based, no religious references, focus on commitment
- **Interfaith**: Universal themes, respectful of both backgrounds, inclusive language
- **LGBTQ+**: Gender-neutral language, equal partnership, celebratory tone
- **Custom**: Follow specific user instructions provided

## Hebrew Requirements
- Use modern Israeli Hebrew for readability unless traditional Aramaic is required by style
- Include Hebrew date in traditional format (e.g., "ט״ו בשבט תשפ״ו")
- Transliterate names if Hebrew is not provided
- Maintain poetic equivalence with English
- Use proper Hebrew punctuation

## Content Structure
Generate the text as a SINGLE PARAGRAPH that seamlessly flows through:
1. Opening (Date, location)
2. Declaration of union
3. The Vows/Covenant
4. Closing

## Important Rules
- NEVER include placeholder text like "[insert here]"
- ALWAYS generate complete, ready-to-use text
- The output text MUST be a single, continuous paragraph (no line breaks)
- Respect the requested word count/length`;

function getStyleGuidelines(style) {
    const guidelines = {
        Orthodox: 'Include traditional Aramaic opening, kinyan formula, mohar (symbolic bride price), specific legal obligations. Use formal Hebrew.',
        Conservative: 'Use egalitarian language with both partners making equal commitments. Include Lieberman clause for mutual consent. Balance tradition with modernity.',
        Reform: 'Focus on personal covenant and mutual growth. Emphasize love, support, and building a Jewish home together. Modern language acceptable.',
        Secular: 'No religious references. Focus on commitment, partnership, shared values. Emphasize the relationship and promises to each other.',
        Interfaith: 'Universal themes of love and commitment. Respectful language that honors both traditions. Focus on shared values and future together.',
        'LGBTQ+': 'Gender-neutral language throughout. Celebrate the union as equal partners. Use inclusive terminology. Emphasize love and chosen family.'
    };

    return guidelines[style] || guidelines.Reform;
}

export function buildGeneratePrompt(data) {
    const hebrewDate = data.hebrew_date || 'the Hebrew date corresponding to their wedding';

    const p1Hebrew = data.partner1.isPhonetic
        ? `Transliterate English name "${data.partner1.english_name}" into Hebrew characters phonetically`
        : (data.partner1.hebrew_name || 'Transliterate English name');

    const p2Hebrew = data.partner2.isPhonetic
        ? `Transliterate English name "${data.partner2.english_name}" into Hebrew characters phonetically`
        : (data.partner2.hebrew_name || 'Transliterate English name');

    const styleInstruction = data.style === 'Custom'
        ? `Custom Style Requirements: ${data.custom_style}`
        : getStyleGuidelines(data.style);

    let midPoint = 150;
    if (data.text_length === 'short') midPoint = 88;
    if (data.text_length === 'medium') midPoint = 150;
    if (data.text_length === 'long') midPoint = 200;
    if (data.text_length === 'custom' && data.custom_length_words) midPoint = parseInt(data.custom_length_words);

    const lengthInstruction = `
## CRITICAL WORD COUNT REQUIREMENT
Target: EXACTLY ${midPoint} words for the English text.
- Minimum: ${midPoint - 5} words
- Maximum: ${midPoint + 5} words
- Count your words carefully before finalizing your response.
- If your draft is too long, trim unnecessary phrases.
- If your draft is too short, add meaningful content.
This is a hard requirement. Text outside this range will be rejected.`;

    return `Create a ${data.style} Ketubah for this couple:

## Partner Information
Partner 1: ${data.partner1.english_name} (Hebrew: ${p1Hebrew})
Partner 2: ${data.partner2.english_name} (Hebrew: ${p2Hebrew})

## Wedding Details
Date: ${data.wedding_date}
Hebrew Date: ${hebrewDate}
Location: ${data.location.venue || 'their chosen venue'}, ${data.location.city}, ${data.location.country || 'USA'}

## Their Love Story
${data.story || 'A beautiful couple beginning their journey together.'}

## Style Guidelines (${data.style})
${styleInstruction}

${lengthInstruction}

Create beautiful, personalized bilingual Ketubah text that:
1. Weaves their story naturally into the covenant
2. Follows the specified style/tradition
3. Is ready to use (no placeholders)
4. Has equivalent meaning in both languages
5. **CRITICAL**: The output must be a SINGLE PARAGRAPH for each language.
6. **CRITICAL**: The English text MUST be between ${midPoint - 5} and ${midPoint + 5} words. Count carefully!`;
}

export function buildRefinePrompt(data) {
    return `The couple wants to refine their Ketubah text.

## Current English Text:
${data.current_english}

## Current Hebrew Text:
${data.current_hebrew}

## Their Request:
${data.instruction}

## Guidelines:
- Make ONLY the changes they requested
- Keep all other text exactly the same
- Maintain consistency between English and Hebrew
- Preserve the overall structure and style

Return the updated text in the same JSON format:
{
  "english_text": "Updated English text",
  "hebrew_text": "Updated Hebrew text",
  "scribe_message": "Brief note about what was changed"
}`;
}
