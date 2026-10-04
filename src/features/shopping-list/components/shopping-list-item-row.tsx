"use client"

import { useState, useTransition } from "react"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { quantityUnitShortLabels } from "@/config/quantity-units"
import {
  deleteShoppingListItemAction,
  purchaseShoppingListItemAndRestockAction,
  setShoppingListItemPurchasedAction,
} from "@/features/shopping-list/actions"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"

interface ShoppingListItemRowProps {
  item: ShoppingListItem
  onEdit: (item: ShoppingListItem) => void
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 2,
})

export function ShoppingListItemRow({
  item,
  onEdit,
}: ShoppingListItemRowProps) {
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState<"restock" | "delete" | null>(
    null
  )
  const [isPending, startTransition] = useTransition()

  function togglePurchased() {
    if (!item.isPurchased && item.inventoryItemId !== undefined) {
      setOpenDialog("restock")
      return
    }

    updatePurchased(false)
  }

  function updatePurchased(shouldRestockInventory: boolean) {
    setOpenDialog(null)
    setError(null)
    setNotice(null)

    startTransition(async () => {
      try {
        const result = shouldRestockInventory
          ? await purchaseShoppingListItemAndRestockAction(item.id)
          : await setShoppingListItemPurchasedAction(item.id, !item.isPurchased)
        if (!result.success) {
          setError(result.message)
          return
        }

        if (shouldRestockInventory) {
          setNotice("Comprado e inventario actualizado.")
        }
      } catch {
        setError("No se ha podido actualizar el producto.")
      }
    })
  }

  function removeItem() {
    setOpenDialog(null)
    setError(null)
    setNotice(null)
    startTransition(async () => {
      try {
        const result = await deleteShoppingListItemAction(item.id)
        if (!result.success) {
          setError(result.message)
        }
      } catch {
        setError("No se ha podido eliminar el producto.")
      }
    })
  }

  return (
    <>
      <article className="rounded-2xl border border-[#dde1d8] bg-white/75 p-4 shadow-[0_8px_25px_rgba(50,72,60,0.04)] dark:border-white/10 dark:bg-[#182e26]/80">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={togglePurchased}
            disabled={isPending}
            aria-label={
              item.isPurchased
                ? `Marcar ${item.name} como pendiente`
                : `Marcar ${item.name} como comprado`
            }
            className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 disabled:opacity-50 ${
              item.isPurchased
                ? "border-[#76977d] bg-[#76977d] text-white"
                : "border-[#aebcaf] hover:border-[#76977d] hover:bg-[#e7efe5] dark:border-[#789086]"
            }`}
          >
            {item.isPurchased ? "✓" : null}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p
                className={`min-w-0 truncate font-semibold ${item.isPurchased ? "text-[#7f8d85] line-through" : ""}`}
              >
                {item.name}
              </p>
              <p className="shrink-0 text-sm font-semibold text-[#6b7a72] dark:text-[#abb8b0]">
                {quantityFormatter.format(item.quantity)}{" "}
                {quantityUnitShortLabels[item.unit]}
              </p>
              {item.isMealPlanGenerated ? (
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f3e8c8] text-[#75611f] dark:bg-[#4b4225] dark:text-[#ead78d]"
                  title="Menú semanal"
                >
                  <svg
                    viewBox="0 0 24 24"
                    role="img"
                    aria-label="Añadido desde el menú semanal"
                    className="size-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 3v3M17 3v3M4 9h16" />
                    <rect x="4" y="5" width="16" height="15" rx="2" />
                    <path d="m9 14 2 2 4-4" />
                  </svg>
                </span>
              ) : null}
            </div>
            {error ? (
              <p className="mt-2 text-xs font-medium text-red-700 dark:text-red-300">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p
                className="mt-2 text-xs font-medium text-[#3e674b] dark:text-[#b9d4c0]"
                aria-live="polite"
              >
                {notice}
              </p>
            ) : null}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(item)}
                disabled={isPending}
                className="rounded-full bg-[#edf0e9] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#e1e7de] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:opacity-50 dark:bg-white/10"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => setOpenDialog("delete")}
                disabled={isPending}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#8f5140] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 dark:text-[#e9a995] dark:hover:bg-red-950/30"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </article>
      <ConfirmationDialog
        open={openDialog === "restock"}
        title={`¿Reponer ${item.name}?`}
        description={`Has comprado ${quantityFormatter.format(item.quantity)} ${quantityUnitShortLabels[item.unit]}. Puedes sumarlo al inventario o marcarlo como comprado sin modificar existencias.`}
        confirmLabel="Comprar y reponer"
        secondaryLabel="Solo marcar comprado"
        onConfirm={() => updatePurchased(true)}
        onSecondary={() => updatePurchased(false)}
        onDismiss={() => setOpenDialog(null)}
      />
      <ConfirmationDialog
        open={openDialog === "delete"}
        title={`Eliminar ${item.name}`}
        description="El producto desaparecerá de la lista de la compra. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        tone="danger"
        onConfirm={removeItem}
        onDismiss={() => setOpenDialog(null)}
      />
    </>
  )
}
