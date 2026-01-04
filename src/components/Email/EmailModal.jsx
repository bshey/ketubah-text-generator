import { useState } from 'react'
import { useKetubanStore } from '../../store/ketubanStore'

export function EmailModal({ onSubmit, onClose }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email) {
            setError('Please enter your email address')
            return
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)

        try {
            await onSubmit(email)
        } catch (err) {
            setError(err.message || 'Failed to send email. Please try again.')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    ×
                </button>

                <div className="modal-header">
                    <span className="modal-icon">✉️</span>
                    <h2>Get Your Ketubah Text</h2>
                    <p>Enter your email to receive a copyable version of your personalized Ketubah text, plus a special offer!</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="modal-error" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : '📧 Send My Ketubah Text'}
                    </button>
                </form>

                <p className="modal-footer-text">
                    Your email will only be used to deliver your Ketubah text. We never share your information.
                </p>
            </div>
        </div>
    )
}
