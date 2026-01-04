import { useKetubanStore } from '../../store/ketubanStore'
import { useHebrewDate } from '../../hooks/useHebrewDate'

export function FormPanel() {
    const {
        partner1, partner2, weddingDate, location, style, story,
        setPartner1, setPartner2, setWeddingDate, setLocation, setStyle, setStory,
        isGenerating
    } = useKetubanStore()

    const { hebrew: hebrewDate, hebrewEnglish } = useHebrewDate(weddingDate)

    const styles = [
        { value: 'Reform', label: 'Reform', desc: 'Modern covenant language, personal connection' },
        { value: 'Conservative', label: 'Conservative', desc: 'Egalitarian with traditional structure' },
        { value: 'Orthodox', label: 'Orthodox', desc: 'Traditional legal elements, Aramaic phrases' },
        { value: 'Secular', label: 'Secular', desc: 'Values-based, no religious references' },
        { value: 'Interfaith', label: 'Interfaith', desc: 'Universal themes, honors both traditions' },
        { value: 'LGBTQ+', label: 'LGBTQ+', desc: 'Gender-neutral, equal partnership' },
    ]

    return (
        <div className="panel form-panel">
            <h2>Create Your Ketubah</h2>

            {/* Partner 1 */}
            <fieldset className="fieldset">
                <legend>Partner 1</legend>
                <div className="form-group">
                    <label htmlFor="p1-english">Full Name (English) *</label>
                    <input
                        id="p1-english"
                        type="text"
                        value={partner1.english_name}
                        onChange={(e) => setPartner1({ english_name: e.target.value })}
                        placeholder="Sarah Cohen"
                        disabled={isGenerating}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="p1-hebrew">Hebrew Name (optional)</label>
                    <input
                        id="p1-hebrew"
                        type="text"
                        className="hebrew-input"
                        value={partner1.hebrew_name}
                        onChange={(e) => setPartner1({ hebrew_name: e.target.value })}
                        placeholder="שרה בת דוד ורבקה"
                        dir="rtl"
                        disabled={isGenerating}
                    />
                    <span className="form-hint">Format: Name ben/bat Father's Name (e.g., שרה בת דוד)</span>
                </div>
            </fieldset>

            {/* Partner 2 */}
            <fieldset className="fieldset">
                <legend>Partner 2</legend>
                <div className="form-group">
                    <label htmlFor="p2-english">Full Name (English) *</label>
                    <input
                        id="p2-english"
                        type="text"
                        value={partner2.english_name}
                        onChange={(e) => setPartner2({ english_name: e.target.value })}
                        placeholder="Michael Levy"
                        disabled={isGenerating}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="p2-hebrew">Hebrew Name (optional)</label>
                    <input
                        id="p2-hebrew"
                        type="text"
                        className="hebrew-input"
                        value={partner2.hebrew_name}
                        onChange={(e) => setPartner2({ hebrew_name: e.target.value })}
                        placeholder="מיכאל בן יעקב ולאה"
                        dir="rtl"
                        disabled={isGenerating}
                    />
                    <span className="form-hint">Format: Name ben/bat Father's Name</span>
                </div>
            </fieldset>

            {/* Wedding Details */}
            <fieldset className="fieldset">
                <legend>Wedding Details</legend>
                <div className="form-group">
                    <label htmlFor="wedding-date">Wedding Date *</label>
                    <input
                        id="wedding-date"
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        disabled={isGenerating}
                        required
                    />
                    {hebrewDate && (
                        <div className="hebrew-date-display">
                            <span className="hebrew-date-label">Hebrew Date:</span>
                            <span className="hebrew-date-value" dir="rtl">{hebrewDate}</span>
                            <span className="hebrew-date-english">({hebrewEnglish})</span>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label htmlFor="venue">Venue (optional)</label>
                    <input
                        id="venue"
                        type="text"
                        value={location.venue}
                        onChange={(e) => setLocation({ venue: e.target.value })}
                        placeholder="Temple Beth El"
                        disabled={isGenerating}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="city">City *</label>
                        <input
                            id="city"
                            type="text"
                            value={location.city}
                            onChange={(e) => setLocation({ city: e.target.value })}
                            placeholder="New York"
                            disabled={isGenerating}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                            id="country"
                            type="text"
                            value={location.country}
                            onChange={(e) => setLocation({ country: e.target.value })}
                            placeholder="USA"
                            disabled={isGenerating}
                        />
                    </div>
                </div>
            </fieldset>

            {/* Style Selection */}
            <fieldset className="fieldset">
                <legend>Ketubah Style *</legend>
                <div className="style-grid">
                    {styles.map((s) => (
                        <label key={s.value} className={`style-option ${style === s.value ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="style"
                                value={s.value}
                                checked={style === s.value}
                                onChange={(e) => setStyle(e.target.value)}
                                disabled={isGenerating}
                            />
                            <span className="style-label">{s.label}</span>
                            <span className="style-desc">{s.desc}</span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {/* Story */}
            <fieldset className="fieldset">
                <legend>Your Story (Optional)</legend>
                <div className="form-group">
                    <label htmlFor="story">Tell us about how you met, your journey together, or anything you'd like woven into your Ketubah</label>
                    <textarea
                        id="story"
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                        placeholder="We met at a coffee shop in Brooklyn. Sarah was reading a book about Jewish history, and Michael asked about it. Three years later, here we are..."
                        rows={5}
                        disabled={isGenerating}
                    />
                    <span className="form-hint">The more detail you share, the more personalized your Ketubah will be!</span>
                </div>
            </fieldset>
        </div>
    )
}
