"use client"

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react"

interface SelectFieldOption {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  options: readonly SelectFieldOption[]
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  className?: string
}

export function SelectField({
  id,
  options,
  name,
  value,
  defaultValue,
  disabled = false,
  onValueChange,
  className = "",
}: SelectFieldProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const fallbackValue = defaultValue ?? options[0]?.value ?? ""
  const [internalValue, setInternalValue] = useState(fallbackValue)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedValue = value ?? internalValue
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === selectedValue)
  )
  const selectedOption = options[selectedIndex]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [isOpen])

  useEffect(() => {
    if (value !== undefined) {
      return
    }

    const form = hiddenInputRef.current?.form
    if (!form) {
      return
    }

    function handleReset() {
      setInternalValue(fallbackValue)
      setIsOpen(false)
    }

    form.addEventListener("reset", handleReset)
    return () => form.removeEventListener("reset", handleReset)
  }, [fallbackValue, value])

  function openListbox() {
    if (disabled) {
      return
    }

    setActiveIndex(selectedIndex)
    setIsOpen(true)
  }

  function selectOption(nextValue: string) {
    if (value === undefined) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault()
        openListbox()
      }
      return
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((current) => (current + 1) % options.length)
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex(
          (current) => (current - 1 + options.length) % options.length
        )
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case "Enter":
      case " ":
        event.preventDefault()
        selectOption(options[activeIndex]?.value ?? selectedValue)
        break
      case "Escape":
        event.preventDefault()
        setIsOpen(false)
        break
      case "Tab":
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {name ? (
        <input
          ref={hiddenInputRef}
          type="hidden"
          name={name}
          value={selectedValue}
          disabled={disabled}
          readOnly
        />
      ) : null}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-activedescendant={
          isOpen ? `${listboxId}-option-${activeIndex}` : undefined
        }
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : openListbox())}
        onKeyDown={handleKeyDown}
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#ccd5ca] bg-white px-4 text-left text-base font-normal outline-none transition focus:border-[#1d4f40] focus:ring-2 focus:ring-[#1d4f40]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#10231c] ${className}`}
      >
        <span className="min-w-0 truncate">{selectedOption?.label}</span>
        <svg
          className={`size-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m3 6 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.375rem)] z-50 max-h-64 w-full overflow-y-auto rounded-2xl border border-[#bfcac0] bg-white p-1.5 text-base shadow-[0_18px_45px_rgba(19,53,43,0.24)] dark:border-[#496058] dark:bg-[#173128]"
        >
          {options.map((option, index) => (
            <button
              key={option.value}
              id={`${listboxId}-option-${index}`}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={option.value === selectedValue}
              onPointerMove={() => setActiveIndex(index)}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option.value)}
              className={`flex min-h-12 w-full cursor-pointer items-center rounded-xl px-3.5 py-2.5 text-left leading-6 ${
                index === activeIndex
                  ? "bg-[#e3ece1] text-[#17352b] dark:bg-[#294b3f] dark:text-white"
                  : "text-[#314d40] dark:text-[#e4ece7]"
              }`}
            >
              <span className="min-w-0 flex-1 break-words">{option.label}</span>
              {option.value === selectedValue ? (
                <span className="ml-3 font-bold" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
