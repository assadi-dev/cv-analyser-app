import { create } from "zustand"

interface ChatPanelStore {
    isOpen: boolean
    isMaximized: boolean
    toggle: () => void
    close: () => void
    open: () => void
    toggleMaximized: () => void
}

export const useChatPanelStore = create<ChatPanelStore>((set) => ({
    isOpen: false,
    isMaximized: false,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    close: () => set({ isOpen: false }),
    open: () => set({ isOpen: true }),
    toggleMaximized: () => set((state) => ({ isMaximized: !state.isMaximized })),
}))