import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

// For Shopify embed - expose init function
window.KetubanGenerator = {
    init: (selector, options = {}) => {
        const container = document.querySelector(selector)
        if (container) {
            createRoot(container).render(
                <StrictMode>
                    <App options={options} />
                </StrictMode>
            )
        }
    }
}

// Auto-init for development
const rootElement = document.getElementById('root')
if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>
    )
}
