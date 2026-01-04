import { useState, useEffect } from 'react'
import { useKetubanStore } from '../../store/ketubanStore'
import { useRefine } from '../../hooks/useRefine'

export function PreviewPanel({ onGetText, onStartOver }) {
    const { englishText, hebrewText, scribeMessage, isRefining } = useKetubanStore()
    const { refine } = useRefine()
    const [instruction, setInstruction] = useState('')

    // Scroll to top when panel mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const handleRefine = async () => {
        if (!instruction.trim()) return

        const success = await refine(instruction)
        if (success) {
            setInstruction('')
        }
    }

    if (!englishText) {
        return null
    }

    return (
        <div className="panel preview-panel">
            <div className="preview-header-actions">
                <button className="btn btn-secondary btn-sm" onClick={onStartOver}>
                    ← Edit Settings / Start Again
                </button>
            </div>
            <h2>Your Ketubah Preview</h2>

            {scribeMessage && (
                <div className="scribe-message">
                    <span className="scribe-icon">📜</span>
                    <p>{scribeMessage}</p>
                </div>
            )}

            <div className="preview-content">
                {/* English Text */}
                <div className="text-section">
                    <h3>English</h3>
                    <div className="text-preview preview-protected">
                        {englishText.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Hebrew Text */}
                <div className="text-section rtl">
                    <h3>עברית</h3>
                    <div className="text-preview preview-protected hebrew-text" dir="rtl">
                        {hebrewText.split('\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Refinement Chat */}
            <div className="refinement-section">
                <h3>Request Changes</h3>
                <div className="chat-input-area">
                    <textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="e.g., Change the groom's name to David, or make the tone more traditional..."
                        rows={3}
                        disabled={isRefining}
                    />
                    <button
                        className="btn btn-secondary btn-refine"
                        onClick={handleRefine}
                        disabled={!instruction.trim() || isRefining}
                    >
                        {isRefining ? 'Updating...' : 'Update Ketubah'}
                    </button>
                </div>
            </div>

            <div className="preview-actions">
                <p className="preview-notice">
                    Satisfied with the text?
                </p>
                <div className="action-buttons">
                    <button
                        className="btn btn-primary"
                        onClick={onGetText}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy Ketubah Text
                    </button>
                </div>
            </div>
        </div>
    )
}
