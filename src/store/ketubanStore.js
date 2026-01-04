import { create } from 'zustand'

export const useKetubanStore = create((set, get) => ({
    // Form state
    partner1: { english_name: '', hebrew_name: '' },
    partner2: { english_name: '', hebrew_name: '' },
    weddingDate: '',
    location: { venue: '', city: '', country: '' },
    style: 'Reform',
    story: '',

    // Generated content
    sessionId: null,
    version: 0,
    englishText: '',
    hebrewText: '',
    scribeMessage: '',

    // UI state
    isGenerating: false,
    isRefining: false,
    showEmailModal: false,
    error: null,

    // Chat history
    chatHistory: [],

    // Actions
    setPartner1: (data) => set({ partner1: { ...get().partner1, ...data } }),
    setPartner2: (data) => set({ partner2: { ...get().partner2, ...data } }),
    setWeddingDate: (date) => set({ weddingDate: date }),
    setLocation: (data) => set({ location: { ...get().location, ...data } }),
    setStyle: (style) => set({ style }),
    setStory: (story) => set({ story }),

    setGenerating: (isGenerating) => set({ isGenerating }),
    setError: (error) => set({ error }),
    setShowEmailModal: (show) => set({ showEmailModal: show }),

    setGenerated: (data) => set({
        sessionId: data.session_id,
        version: data.version,
        englishText: data.english_text,
        hebrewText: data.hebrew_text,
        scribeMessage: data.scribe_message,
    }),

    addChatMessage: (message) => set({
        chatHistory: [...get().chatHistory, message],
    }),

    reset: () => set({
        sessionId: null,
        version: 0,
        englishText: '',
        hebrewText: '',
        scribeMessage: '',
        chatHistory: [],
        error: null,
    }),
}))
