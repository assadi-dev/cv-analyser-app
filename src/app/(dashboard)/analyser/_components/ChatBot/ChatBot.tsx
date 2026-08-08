"use client"

import { Bot, MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader } from "@/components/ui/Card"
import { Input } from "@/components/ui/input"
import { useAnalyseChat } from "../../_hooks/useAnalyseChat"
import { useChatPanel } from "../../_hooks/useChatPanel"
import { ChatMessageList } from "./ChatMessageList"
import { motion } from "motion/react"

export function ChatBot({ isOpen, toggle, close }: ReturnType<typeof useChatPanel>) {

  const { messages, input, setInput, send, isPending, isEnabled, canSend } = useAnalyseChat()

  return (
    <div className="fixed lg:absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <Card className="w-[min(360px,calc(100vw-3rem))] flex flex-col gap-3 min-h-[400px]">
            <CardHeader
              icon={<MessageCircle size={15} className="text-[var(--color-primary)]" />}
              title="Assistant IA"
              subtitle={isEnabled ? "À propos de votre analyse" : "Analyse requise"}
              action={
                <Button variant="ghost" size="sm" onClick={close} aria-label="Fermer la discussion">
                  <X size={14} />
                </Button>
              }
              className="mb-0"
            />

            <ChatMessageList messages={messages} isPending={isPending} isEnabled={isEnabled} />

            <form onSubmit={send} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez une question..."
                disabled={!isEnabled}
              />
              <Button type="submit" disabled={!canSend} aria-label="Envoyer">
                <Send size={16} />
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      <Button
        onClick={toggle}
        className="w-12 h-12 p-0 rounded-full"
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant"}
      >
        {isOpen ? <X size={20} /> : <Bot size={22} />}
      </Button>
    </div>
  )
}
