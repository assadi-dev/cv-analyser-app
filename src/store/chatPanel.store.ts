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
    toggle: () => set((state) => ({ ...state, isOpen: !state.isOpen })),
    close: () => set((state) => ({ ...state, isOpen: false })),
    open: () => set((state) => ({ ...state, isOpen: true })),
    toggleMaximized: () => set((state) => ({ ...state, isMaximized: !state.isMaximized })),

}))