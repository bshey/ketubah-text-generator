import { useKetubanStore } from '../../store/ketubanStore'

export function PreviewPanel({ onGetText }) {
    const { englishText, hebrewText, scribeMessage } = useKetubanStore()

    if (!englishText) {
        return null
    }

    return (
        <div className="panel preview-panel">
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

            <div className="preview-actions">
                <p className="preview-notice">
                    ✉️ Enter your email to receive a copyable version of your Ketubah text
                </p>
                <button className="btn btn-primary" onClick={onGetText}>
                    Get My Ketubah Text
                </button>
            </div>
        </div>
    )
}
