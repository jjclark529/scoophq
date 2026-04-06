import { create } from 'zustand'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatStore {
  messages: ChatMessage[]
  isOpen: boolean
  isLoading: boolean
  model: string
  addMessage: (role: 'user' | 'assistant', content: string) => void
  setLoading: (loading: boolean) => void
  toggleChat: () => void
  setModel: (model: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "Hey! I'm Captain Scoop 🍦 — your business development assistant. I can help with market research, marketing strategy, lead generation, competitor analysis, customer insights, and growth planning. What would you like to work on?",
      timestamp: new Date(),
    },
  ],
  isOpen: true,
  isLoading: false,
  model: 'gpt-4o',
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: Date.now().toString(), role, content, timestamp: new Date() },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setModel: (model) => set({ model }),
}))