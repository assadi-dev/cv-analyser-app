"use client"

import { useChatPanelStore } from "@/store/chatPanel.store"

/** Gère l'ouverture du panneau de discussion flottant. */
export function useChatPanel() {
  const { isOpen, toggle, close, open, isMaximized, toggleMaximized } = useChatPanelStore()


  return { isOpen, toggle, close, open, isMaximized, toggleMaximized }
}
