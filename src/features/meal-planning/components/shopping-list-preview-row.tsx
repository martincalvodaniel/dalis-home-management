"use client"

import { useId } from "react"
import { quantityUnitShortLabels } from "@/config/quantity-units"
import type { EditableShoppingListItem } from "./shopping-list-preview"

interface ShoppingListPreviewRowProps {
  item: EditableShoppingListItem
  disabled: boolean
  onInventoryQuantityChange: (inventoryItemId: string, quantity: number) => void
  onShoppingQuantityChange: (inventoryItemId: string, quantity: number) => void
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
})

function normalizeInputQuantity(value: number): number {
  return Number.isFinite(value) ? Math.max(value, 0) : 0
}

export function ShoppingListPreviewRow({
  item,
  disabled,
  onInventoryQuantityChange,
  onShoppingQuantityChange,
}: ShoppingListPreviewRowProps) {
  const inventoryId = useId()
  const shoppingId = useId()
  const unitLabel = quantityUnitShortLabels[item.unit]

  return (
    <li className="grid gap-3 rounded-2xl border border-white/65 bg-white/55 p-3 lg:grid-cols-[minmax(10rem,1fr)_repeat(3,minmax(7rem,0.55fr))] lg:items-center dark:border-white/5 dark:bg-white/5">
      <div className="min-w-0">
        <p className="truncate font-semibold">{item.name}</p>
        <p className="mt-1 text-xs text-[#69705b] lg:hidden dark:text-[#c0c7b5]">
          Necesitas {quantityFormatter.format(item.requiredQuantity)}{" "}
          {unitLabel}
        </p>
      </div>

      <div className="hidden text-sm font-semibold lg:block">
        {quantityFormatter.format(item.requiredQuantity)} {unitLabel}
      </div>

      <label
        className="block text-xs font-semibold lg:text-sm"
        htmlFor={inventoryId}
      >
        <span className="sr-only">Inventario de {item.name}</span>
        <span className="lg:sr-only" aria-hidden="true">
          En inventario
        </span>
        <span className="relative mt-1.5 block lg:mt-0">
          <input
            id={inventoryId}
            type="number"
            min="0"
            max="999999"
            step="any"
            value={item.inventoryQuantity}
            disabled={disabled}
            onChange={(event) =>
              onInventoryQuantityChange(
                item.inventoryItemId,
                normalizeInputQuantity(event.currentTarget.valueAsNumber)
              )
            }
            className="min-h-11 w-full rounded-xl border border-[#c8cab1] bg-white py-2 pl-3 pr-12 font-normal outline-none transition focus:border-[#74794f] focus:ring-2 focus:ring-[#74794f]/20 disabled:opacity-65 dark:border-white/15 dark:bg-[#202d22]"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-[#69705b] dark:text-[#c0c7b5]">
            {unitLabel}
          </span>
        </span>
      </label>

      <label
        className="block text-xs font-semibold lg:text-sm"
        htmlFor={shoppingId}
      >
        <span className="sr-only">Cantidad a añadir de {item.name}</span>
        <span className="lg:sr-only" aria-hidden="true">
          Añadir a la compra
        </span>
        <span className="relative mt-1.5 block lg:mt-0">
          <input
            id={shoppingId}
            type="number"
            min="0"
            max="999999"
            step="any"
            value={item.quantity}
            disabled={disabled}
            onChange={(event) =>
              onShoppingQuantityChange(
                item.inventoryItemId,
                normalizeInputQuantity(event.currentTarget.valueAsNumber)
              )
            }
            className="min-h-11 w-full rounded-xl border border-[#c8cab1] bg-[#fff8ed] py-2 pl-3 pr-12 font-normal outline-none transition focus:border-[#a75938] focus:ring-2 focus:ring-[#a75938]/20 disabled:opacity-65 dark:border-[#80543d] dark:bg-[#3c2d24]"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-[#7d5947] dark:text-[#e4c3b3]">
            {unitLabel}
          </span>
        </span>
      </label>
    </li>
  )
}
