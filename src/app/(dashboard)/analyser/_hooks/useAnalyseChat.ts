"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useAnalyseStore } from "@/store/analyse.store"
import type { ChatMessage } from "@/types"
import { ANALYSE_CHAT_MUTATION_KEY, sendChatMessage } from "../_api/analyse.api"

const FALLBACK_ANSWER = "Désolé, une erreur est survenue."

/** Gère la conversation avec l'IA à propos de l'analyse enregistrée. */
export function useAnalyseChat() {
  const savedAnalyseId = useAnalyseStore((s) => s.savedAnalyseId)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")

  const { mutate, isPending } = useMutation({
    mutationKey: [ANALYSE_CHAT_MUTATION_KEY],
    mutationFn: sendChatMessage,
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: "assistant", content: res.message }])
    },
    onError: (error) => {
      logError(error, "useAnalyseChat")
      setMessages((prev) => [...prev, { role: "assistant", content: FALLBACK_ANSWER }])
    },
  })

  const isEnabled = savedAnalyseId !== null
  const canSend = isEnabled && input.trim().length > 0 && !isPending

  function send(e: React.FormEvent) {
    e.preventDefault()
    if (!savedAnalyseId || !canSend) return

    const message = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: message }])
    setInput("")
    mutate({ analyse_id: savedAnalyseId, message })
  }

  return { messages, input, setInput, send, isPending, isEnabled, canSend }
}
