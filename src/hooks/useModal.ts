"use client"

import { useState, useCallback } from "react"

interface ModalState<T = undefined> {
  isOpen: boolean
  props: T | undefined
  lockBackdrop: boolean
}

interface UseModalOptions {
  lockBackdrop?: boolean
}

export function useModal<T = undefined>(options: UseModalOptions = {}) {
  const [state, setState] = useState<ModalState<T>>({
    isOpen: false,
    props: undefined,
    lockBackdrop: options.lockBackdrop ?? false,
  })

  const open = useCallback((props?: T) => {
    setState((prev) => ({ ...prev, isOpen: true, props }))
  }, [])

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false, props: undefined }))
  }, [])

  return {
    isOpen: state.isOpen,
    modalProps: state.props,
    lockBackdrop: state.lockBackdrop,
    open,
    close,
  }
}
