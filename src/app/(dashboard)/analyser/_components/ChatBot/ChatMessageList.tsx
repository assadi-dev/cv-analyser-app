"use client"

import { cn } from "@/lib/utils"
import MarkdownContent from "@/components/ui/MarkdownContent"
import type { ChatMessage } from "@/types"

interface ChatMessageListProps {
  messages: ChatMessage[]
  isPending: boolean
  isEnabled: boolean
}

export function ChatMessageList({ messages, isPending, isEnabled }: ChatMessageListProps) {
  return (
    <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
      {messages.length === 0 && (
        <p className="text-[12px] text-[var(--color-text-subtle)] py-4 text-center">
          {isEnabled
            ? "Posez une question sur votre analyse."
            : "Lancez une analyse pour discuter avec l'IA."}
        </p>
      )}

      {messages.map((message, index) => (
        <div
          key={`${message.role}-${index}`}
          className={cn(
            "px-3 py-2 rounded-[10px] text-[12px] leading-relaxed max-w-[85%]",
            message.role === "user"
              ? "self-end bg-[var(--color-primary-light)] text-[var(--color-primary)]"
              : "self-start bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]",
          )}
        >
          {message.role === "assistant" ? (
            <MarkdownContent content={message.content} />
          ) : (
            message.content
          )}
        </div>
      ))}

      {isPending && (
        <span className="self-start text-[11px] text-[var(--color-text-subtle)] animate-pulse-soft">
          L&apos;assistant rédige une réponse...
        </span>
      )}
    </div>
  )
}
