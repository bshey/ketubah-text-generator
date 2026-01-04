import { useState } from 'react'
import { useKetubanStore } from './store/ketubanStore'
import { useGenerate } from './hooks/useGenerate'
import { FormPanel } from './components/Form/FormPanel'
import { PreviewPanel } from './components/Preview/PreviewPanel'
import { EmailModal } from './components/Email/EmailModal'
import { ConfirmationPage } from './components/Confirmation/ConfirmationPage'
import { sendText } from './services/api'

function App({ options = {} }) {
    const {
        englishText, hebrewText, isGenerating, error,
        showEmailModal, setShowEmailModal, setError
    } = useKetubanStore()
    const { generate, canGenerate } = useGenerate()
    const hasGenerated = !!englishText

    // Track if we're showing confirmation page
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const [couponCode, setCouponCode] = useState('')

    const handleEmailSubmit = async (email) => {
        try {
            const response = await sendText({
                email,
                english_text: englishText,
                hebrew_text: hebrewText
            })

            // Store email and coupon for confirmation page
            setSubmittedEmail(email)
            setCouponCode(response.data?.coupon_code || 'FREETEXT')
            setShowEmailModal(false)
            setShowConfirmation(true)
        } catch (err) {
            throw err
        }
    }

    // Show confirmation page after email submission
    if (showConfirmation) {
        return (
            <ConfirmationPage
                email={submittedEmail}
                englishText={englishText}
                hebrewText={hebrewText}
                couponCode={couponCode}
                onStartOver={() => {
                    setShowConfirmation(false)
                    useKetubanStore.getState().reset()
                }}
            />
        )
    }

    return (
        <div className="ketubah-generator">
            <header className="header">
                <h1>Ketubah Text Generator</h1>
                <p className="subtitle">Powered by The Wise Scribe</p>
            </header>

            {error && (
                <div className="error-banner" role="alert">
                    {error}
                    <button
                        className="error-dismiss"
                        onClick={() => setError(null)}
                        aria-label="Dismiss error"
                    >
                        ×
                    </button>
                </div>
            )}

            <main className="main-layout">
                <div className="form-column">
                    <FormPanel />

                    <button
                        className="btn btn-primary btn-generate"
                        onClick={generate}
                        disabled={!canGenerate || isGenerating}
                    >
                        {isGenerating ? 'Crafting your Ketubah...' : '✨ Generate Ketubah'}
                    </button>
                </div>

                {hasGenerated && (
                    <div className="preview-column">
                        <PreviewPanel onGetText={() => setShowEmailModal(true)} />
                    </div>
                )}
            </main>

            {isGenerating && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <p className="loading-text">The Wise Scribe is crafting your Ketubah...</p>
                    <p className="loading-subtext">This may take 10-20 seconds</p>
                </div>
            )}

            {showEmailModal && (
                <EmailModal
                    onSubmit={handleEmailSubmit}
                    onClose={() => setShowEmailModal(false)}
                />
            )}
        </div>
    )
}

export default App
