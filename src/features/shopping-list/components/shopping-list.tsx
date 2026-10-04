"use client"

import { useId } from "react"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"
import { ClearPurchasedButton } from "./clear-purchased-button"
import { ShoppingListItemRow } from "./shopping-list-item-row"

interface ShoppingListProps {
  items: ShoppingListItem[]
  onEdit: (item: ShoppingListItem) => void
}

export function ShoppingList({ items, onEdit }: ShoppingListProps) {
  const titleId = useId()
  const pendingItems = items.filter((item) => !item.isPurchased)
  const purchasedItems = items.filter((item) => item.isPurchased)

  if (items.length === 0) {
    return (
      <section className="grid min-h-72 place-items-center rounded-[1.75rem] border border-dashed border-[#d8c5b8] bg-white/35 p-8 text-center dark:border-white/15 dark:bg-white/[0.025]">
        <div className="max-w-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f5dfd2] text-2xl dark:bg-[#4a3025]">
            <span aria-hidden="true">✓</span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
            La lista está vacía
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#697970] dark:text-[#aebbb3]">
            Añade lo primero que necesitéis en vuestra próxima compra.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby={titleId}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a8a81] dark:text-[#9baaa1]">
        Por comprar
      </p>
      <h2
        id={titleId}
        className="mt-1 text-2xl font-semibold tracking-[-0.04em]"
      >
        Nuestra lista
      </h2>

      <div className="mt-5 space-y-3">
        {pendingItems.length === 0 ? (
          <div className="rounded-2xl border border-[#dce5d9] bg-[#e9f0e7]/65 px-5 py-8 text-center dark:border-[#345245] dark:bg-[#203b31]">
            <p className="font-semibold">Todo comprado</p>
            <p className="mt-1 text-sm text-[#627268] dark:text-[#b7c5bc]">
              No queda nada pendiente en la lista.
            </p>
          </div>
        ) : (
          pendingItems.map((item) => (
            <ShoppingListItemRow key={item.id} item={item} onEdit={onEdit} />
          ))
        )}
      </div>

      {purchasedItems.length > 0 ? (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#89958e]">
              Ya comprado
            </p>
            <ClearPurchasedButton count={purchasedItems.length} />
          </div>
          <div className="mt-3 space-y-3 opacity-75">
            {purchasedItems.map((item) => (
              <ShoppingListItemRow key={item.id} item={item} onEdit={onEdit} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
