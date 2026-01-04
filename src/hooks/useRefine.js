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

            if (response.success) {
                setGenerated(response.data)
                return true
            } else {
                throw new Error(response.error || 'Refinement failed')
            }
        } catch (err) {
            setError(err.message)
            return false
        } finally {
            setRefining(false)
        }
    }

    return { refine }
}
