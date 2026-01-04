const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8787'

export async function generateKetubah(data) {
    const response = await fetch(`${API_ENDPOINT}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Generation failed')
    }

    return response.json()
}

export async function refineKetubah(data) {
    const response = await fetch(`${API_ENDPOINT}/api/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Refinement failed')
    }

    return response.json()
}

export async function sendText(data) {
    const response = await fetch(`${API_ENDPOINT}/api/send-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Email send failed')
    }

    return response.json()
}
