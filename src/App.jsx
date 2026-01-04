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
        englishText, hebrewText, isGenerating, isRefining, error,
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
            setCouponCode(response.data?.coupon_code || 'FREETEXT4783')
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
            {/* Header removed - use separate Shopify section for page title */}

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

            <main className="main-layout layout-centered">
                {!hasGenerated ? (
                    <div className="form-column">
                        <FormPanel />

                        <button
                            className="btn btn-primary btn-generate"
                            onClick={generate}
                            disabled={!canGenerate || isGenerating}
                        >
                            {isGenerating ? 'Crafting your Ketubah...' : '✨ Generate Text'}
                        </button>
                    </div>
                ) : (
                    <div className="preview-column">
                        <PreviewPanel
                            onGetText={() => setShowEmailModal(true)}
                            onStartOver={() => useKetubanStore.getState().reset()}
                        />
                    </div>
                )}
            </main>

            {(isGenerating || isRefining) && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <p className="loading-text">
                        {isRefining ? 'Polishing your changes...' : 'Crafting your Ketubah...'}
                    </p>
                    <p className="loading-text">This may take 10-20 seconds</p>
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
