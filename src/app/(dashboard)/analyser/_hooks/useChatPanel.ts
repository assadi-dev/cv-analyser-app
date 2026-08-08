"use client"

import { useState } from "react"

/** Gère l'ouverture du panneau de discussion flottant. */
export function useChatPanel() {
  const [isOpen, setIsOpen] = useState(false)

  function toggle() {
    setIsOpen((prev) => !prev)
  }

  function close() {
    setIsOpen(false)
  }

  return { isOpen, toggle, close }
}
