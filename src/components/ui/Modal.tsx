"use client"

import { useEffect, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: "md" | "lg" | "xl"
  className?: string
}

const SIZES = {
  md:  "max-w-[560px]",
  lg:  "max-w-[860px]",
  xl:  "max-w-[1100px]",
}

export function Modal({ open, onClose, title, icon, children, footer, size = "lg", className }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={cn(
          "w-full rounded-[var(--radius-2xl)] bg-white flex flex-col overflow-hidden",
          "shadow-[var(--shadow-modal)]",
          SIZES[size],
          className,
        )}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 border-b shrink-0"
          style={{ height: "60px", borderColor: "var(--color-border)" }}
        >
          {icon && (
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
              style={{ background: "var(--color-primary-light)" }}
            >
              {icon}
            </div>
          )}
          <span className="text-[15px] font-bold" style={{ color: "var(--color-text-primary)" }}>
            {title}
          </span>
          <button
            className="ml-auto w-8 h-8 rounded-[8px] flex items-center justify-center hover:bg-[var(--color-surface-muted)] transition-colors"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={16} style={{ color: "var(--color-text-muted)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div
            className="flex items-center gap-3 px-6 border-t shrink-0"
            style={{ height: "64px", borderColor: "var(--color-border)" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
