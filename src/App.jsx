import { useKetubanStore } from './store/ketubanStore'

function App({ options = {} }) {
    const { englishText, isGenerating, error } = useKetubanStore()
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
                </div>
            )}

            <main className="main-layout">
                <div className="panel form-panel">
                    <h2>Create Your Ketubah</h2>
                    <p>Form components coming in Build 6...</p>
                </div>

                {hasGenerated && (
                    <>
                        <div className="panel preview-panel">
                            <h2>Preview</h2>
                            <p>Preview panel coming in Build 10...</p>
                        </div>
                        <div className="panel chat-panel">
                            <h2>Refine with The Scribe</h2>
                            <p>Chat interface coming in Build 11...</p>
                        </div>
                    </>
                )}
            </main>

            {isGenerating && (
                <div className="loading-overlay">
                    <div className="loading-spinner" />
                    <p>The Wise Scribe is crafting your Ketubah...</p>
                </div>
            )}
        </div>
    )
}

export default App
