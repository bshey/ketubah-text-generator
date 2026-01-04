import { useKetubanStore } from './store/ketubanStore'
import { useGenerate } from './hooks/useGenerate'
import { FormPanel } from './components/Form/FormPanel'
import { PreviewPanel } from './components/Preview/PreviewPanel'

function App({ options = {} }) {
    const { englishText, isGenerating, error, scribeMessage } = useKetubanStore()
    const { generate, canGenerate } = useGenerate()
    const hasGenerated = !!englishText

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
                        onClick={() => useKetubanStore.getState().setError(null)}
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
                        <PreviewPanel />
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
        </div>
    )
}

export default App
