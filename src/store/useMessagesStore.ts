import { ChatMessageItem } from "@/app/(dashboard)/analyser/_types"
import { create } from "zustand"


export type ChatMessageSSEType = "start" | "token" | "complete" | "error"

export type ChatMessageSSEEvent = {
    id: string,
    conversation_id: string,
    type: ChatMessageSSEType,
    chunk?: string | null,
    message?: string | null,
    complete?: boolean | null,
    timestamp?: string | null
}

interface ChatMessagesStore {

    conversation_id: string,
    messages: ChatMessageItem[]
    setConversationId: (id: string) => void,
    addMessage: (message: ChatMessageItem) => void
    clearMessages: () => void
    setMessages: (messages: ChatMessageItem[]) => void
}

export const useMessagesStore = create<ChatMessagesStore>((set) => ({
    conversation_id: "",
    messages: [],
    setConversationId: (conversation_id: string) => set((state) => ({ ...state, conversation_id: conversation_id })),
    addMessage: (message) => set((state) => { return { ...state, messages: [...state.messages, message] } }),
    clearMessages: () => set((state) => {
        return { ...state, messages: [] }
    }),
    setMessages: (messages) => set((state) => {
        return { ...state, messages: [...messages] }
    }),
}))