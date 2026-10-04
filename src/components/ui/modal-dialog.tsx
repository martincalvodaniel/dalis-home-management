"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"

interface ModalDialogProps {
  open: boolean
  ariaLabel: string
  size?: "md" | "lg"
  children: ReactNode
  onDismiss: () => void
}

const sizeClasses = {
  md: "max-w-xl",
  lg: "max-w-2xl",
} as const

export function ModalDialog({
  open,
  ariaLabel,
  size = "md",
  children,
  onDismiss,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
      className={`m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto border-0 bg-transparent p-0 text-[#17352b] shadow-[0_28px_90px_rgba(10,35,27,0.35)] backdrop:bg-[#0b2119]/65 backdrop:backdrop-blur-sm dark:text-[#f4f1e7] ${sizeClasses[size]}`}
    >
      {children}
    </dialog>
  )
}
