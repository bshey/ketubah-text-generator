import { useCallback } from 'react'
import { useKetubanStore } from '../store/ketubanStore'
import { generateKetubah } from '../services/api'

export function useGenerate() {
    const {
        partner1, partner2, weddingDate, location, style, story,
        setGenerating, setGenerated, setError
    } = useKetubanStore()

    const canGenerate = Boolean(
        partner1.english_name &&
        partner2.english_name &&
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
                location,
                style,
                story
            })

            if (response.success) {
                setGenerated(response.data)
            } else {
                setError(response.error || 'Generation failed')
            }
        } catch (err) {
            console.error('Generation error:', err)
            setError(err.message || 'Failed to generate Ketubah. Please try again.')
        } finally {
            setGenerating(false)
        }
    }, [partner1, partner2, weddingDate, location, style, story, canGenerate, setError, setGenerating, setGenerated])

    return { generate, canGenerate }
}
