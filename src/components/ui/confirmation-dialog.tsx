"use client"

import { useEffect, useRef } from "react"

interface ConfirmationDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onConfirm: () => void
  onDismiss: () => void
  cancelLabel?: string
  secondaryLabel?: string
  onSecondary?: () => void
  tone?: "default" | "danger"
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onDismiss,
  cancelLabel = "Cancelar",
  secondaryLabel,
  onSecondary,
  tone = "default",
}: ConfirmationDialogProps) {
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
      onCancel={(event) => {
        event.preventDefault()
        onDismiss()
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-[1.75rem] border border-[#d8dfd7] bg-[#fbfaf6] p-0 text-[#17352b] shadow-[0_28px_90px_rgba(10,35,27,0.35)] backdrop:bg-[#0b2119]/65 backdrop:backdrop-blur-sm dark:border-white/15 dark:bg-[#182e26] dark:text-[#f4f1e7]"
    >
      <div className="p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c36d49]">
          Confirmación
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#63736a] dark:text-[#b4c0b8]">
          {description}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#ccd5ca] px-5 text-sm font-semibold transition hover:bg-[#edf0e9] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:border-white/15 dark:hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          {secondaryLabel && onSecondary ? (
            <button
              type="button"
              onClick={onSecondary}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#9bb0a1] px-5 text-sm font-semibold text-[#315847] transition hover:bg-[#e7efe5] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:border-[#587166] dark:text-[#d4e1d8] dark:hover:bg-white/10"
            >
              {secondaryLabel}
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-[#182e26] ${
              tone === "danger"
                ? "bg-[#a34435] hover:bg-[#89372c] focus:ring-[#a34435]"
                : "bg-[#1d4f40] hover:bg-[#173f34] focus:ring-[#1d4f40]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  )
}
