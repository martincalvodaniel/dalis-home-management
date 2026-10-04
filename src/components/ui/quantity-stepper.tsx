"use client"

import {
  adjustQuantity,
  getQuantityStep,
} from "@/components/ui/quantity-stepper-value"
import { quantityUnitShortLabels } from "@/config/quantity-units"
import type { QuantityUnit } from "@/schemas/quantity-unit"

interface QuantityStepperProps {
  value: number
  unit: QuantityUnit
  minimum: number
  label: string
  disabled?: boolean
  className?: string
  onChange: (quantity: number) => void
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
})

export function QuantityStepper({
  value,
  unit,
  minimum,
  label,
  disabled = false,
  className,
  onChange,
}: QuantityStepperProps) {
  const step = getQuantityStep(unit)
  const canDecrease = value > minimum
  const canIncrease = value < 999_999

  return (
    <div
      className={`inline-flex shrink-0 items-center rounded-full text-xs font-bold ${className ?? "bg-[#e5ede3] text-[#365b43] dark:bg-[#294b3e] dark:text-[#cfe2d5]"}`}
    >
      <button
        type="button"
        onClick={() =>
          onChange(adjustQuantity(value, step, "decrease", minimum))
        }
        disabled={disabled || !canDecrease}
        aria-label={`Reducir cantidad de ${label}`}
        className="grid size-8 place-items-center rounded-full text-base transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
      >
        −
      </button>
      <span className="min-w-14 text-center tabular-nums">
        {quantityFormatter.format(value)} {quantityUnitShortLabels[unit]}
      </span>
      <button
        type="button"
        onClick={() =>
          onChange(adjustQuantity(value, step, "increase", minimum))
        }
        disabled={disabled || !canIncrease}
        aria-label={`Aumentar cantidad de ${label}`}
        className="grid size-8 place-items-center rounded-full text-base transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
      >
        +
      </button>
    </div>
  )
}
