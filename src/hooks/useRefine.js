import { useKetubanStore } from '../store/ketubanStore'
import { refineKetubah } from '../services/api'

export function useRefine() {
    const {
        sessionId, version, englishText, hebrewText,
        setRefining, setGenerated, setError
    } = useKetubanStore()

    const refine = async (instruction) => {
        if (!englishText || !hebrewText) return

        try {
            setRefining(true)
            setError(null)

            const response = await refineKetubah({
                session_id: sessionId,
                current_version: version,
                current_english: englishText,
                current_hebrew: hebrewText,
                instruction
            })

            // API returns data directly (english_text, hebrew_text, etc.)
            setGenerated(response)
            return true
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setRefining(false)
        }
    }

    return { refine }
}
