import { useCallback } from 'react'
import { useKetubanStore } from '../store/ketubanStore'
import { generateKetubah } from '../services/api'
import { useHebrewDate } from './useHebrewDate'

export function useGenerate() {
    const {
        partner1, partner2, weddingDate, isAfterSunset, location, style, customStyle, story,
        textLength, customLengthWords,
        setGenerating, setGenerated, setError
    } = useKetubanStore()

    const { hebrewEnglish } = useHebrewDate(weddingDate, isAfterSunset)

    const canGenerate = Boolean(
        partner1.english_name &&
        (partner1.hebrew_name || partner1.isPhonetic) &&
        partner2.english_name &&
        (partner2.hebrew_name || partner2.isPhonetic) &&
        weddingDate &&
        location.city &&
        style
    )

    const generate = useCallback(async () => {
        if (!canGenerate) {
            setError('Please fill in all required fields')
            return
        }

        setError(null)
        setGenerating(true)

        try {
            const response = await generateKetubah({
                partner1,
                partner2,
                wedding_date: weddingDate,
                hebrew_date: hebrewEnglish,
                location,
                style,
                custom_style: customStyle,
                story,
                text_length: textLength,
                custom_length_words: customLengthWords
            })

            // API returns data directly (english_text, hebrew_text, etc.)
            setGenerated(response)
        } catch (err) {
            console.error('Generation error:', err)
            setError(err.message || 'Failed to generate Ketubah. Please try again.')
        } finally {
            setGenerating(false)
        }
    }, [partner1, partner2, weddingDate, isAfterSunset, hebrewEnglish, location, style, customStyle, story, textLength, customLengthWords, canGenerate, setError, setGenerating, setGenerated])

    return { generate, canGenerate }
}
