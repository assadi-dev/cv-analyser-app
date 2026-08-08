import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'


interface RememberMeStore {
    rememberMe: boolean
    setRememberMe: (rememberMe: boolean) => void
    toggleRememberMe: () => void
}

export const useRememberMeStore = create<RememberMeStore>()(persist(
    (set, get) => ({
        rememberMe: false,
        setRememberMe: (rememberMe) => set({ rememberMe }),
        toggleRememberMe: () => set({ rememberMe: !get().rememberMe }),
    }),
    {
        name: "cv-analyser:remember-me",
        storage: createJSONStorage(() => localStorage),

    }
))