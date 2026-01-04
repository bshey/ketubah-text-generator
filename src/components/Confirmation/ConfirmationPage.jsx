import { useState, useEffect } from 'react'

export function ConfirmationPage({ email, englishText, hebrewText, couponCode, onStartOver }) {
    const [copiedEnglish, setCopiedEnglish] = useState(false)
    const [copiedHebrew, setCopiedHebrew] = useState(false)

    // Scroll to top when page mounts
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const copyToClipboard = async (text, setCopied) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <div className="ketubah-generator confirmation-page">
            <header className="confirmation-header">
                <h1>✅ Your Ketubah Text is Ready!</h1>
                <p className="subtitle">We've also sent a copy to {email}</p>
            </header>

            <main className="confirmation-content">
                {/* Coupon Section */}
                <div className="coupon-section">
                    <div className="coupon-box" style={{ width: '100%', justifyContent: 'center' }}>
                        <span className="coupon-icon">🎁</span>
                        <div className="coupon-text" style={{ textAlign: 'center' }}>
                            <h3>$30 Credit: Custom Text Service</h3>
                            <p style={{ maxWidth: '600px', margin: '0.5rem auto' }}>
                                This code gives you a <strong>$30 credit</strong> to offset the cost of our "Custom English & Hebrew Translation" service.
                                Use your newly generated text to order any of our beautiful custom Ketubahs.
                            </p>
                            <div className="coupon-code">{couponCode}</div>
                        </div>
                    </div>
                </div>

                {/* Copyable Text Sections */}
                <div className="text-sections">
                    {/* English */}
                    <div className="copyable-section">
                        <div className="section-header">
                            <h2>English Version</h2>
                            <button
                                className="btn btn-secondary btn-copy"
                                onClick={() => copyToClipboard(englishText, setCopiedEnglish)}
                            >
                                {copiedEnglish ? '✓ Copied!' : '📋 Copy'}
                            </button>
                        </div>
                        <div className="copyable-text">
                            {englishText.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Hebrew */}
                    <div className="copyable-section rtl">
                        <div className="section-header">
                            <h2>גרסה עברית</h2>
                            <button
                                className="btn btn-secondary btn-copy"
                                onClick={() => copyToClipboard(hebrewText, setCopiedHebrew)}
                            >
                                {copiedHebrew ? '✓ הועתק!' : '📋 העתק'}
                            </button>
                        </div>
                        <div className="copyable-text hebrew-text" dir="rtl">
                            {hebrewText.split('\n').map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="confirmation-actions">
                    <button className="btn btn-secondary" onClick={onStartOver}>
                        ← Start Again
                    </button>
                    <a href="https://maybie.co" className="btn btn-primary">
                        Browse Our Collection →
                    </a>
                </div>
            </main>
        </div>
    )
}
