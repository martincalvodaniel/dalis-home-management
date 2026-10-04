"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { prepareWeeklyShoppingListAction } from "@/features/meal-planning/actions"
import type { ShoppingListSuggestion } from "@/features/meal-planning/shopping-list-suggestions"
import { ShoppingListPreviewRow } from "./shopping-list-preview-row"

interface ShoppingListPreviewProps {
  weekStart: string
  suggestions: ShoppingListSuggestion[]
}

export interface EditableShoppingListItem extends ShoppingListSuggestion {
  inventoryQuantity: number
  quantity: number
}

function roundQuantity(quantity: number): number {
  return Math.round(quantity * 1_000_000) / 1_000_000
}

export function ShoppingListPreview({
  weekStart,
  suggestions,
}: ShoppingListPreviewProps) {
  const [items, setItems] = useState<EditableShoppingListItem[]>(suggestions)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)
  const [isPending, startTransition] = useTransition()

  function updateInventoryQuantity(
    inventoryItemId: string,
    inventoryQuantity: number
  ) {
    setMessage(null)
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.inventoryItemId === inventoryItemId
          ? {
              ...item,
              inventoryQuantity,
              quantity: roundQuantity(
                Math.max(item.requiredQuantity - inventoryQuantity, 0)
              ),
            }
          : item
      )
    )
  }

  function updateShoppingQuantity(
    inventoryItemId: string,
    shoppingQuantity: number
  ) {
    setMessage(null)
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.inventoryItemId === inventoryItemId
          ? { ...item, quantity: shoppingQuantity }
          : item
      )
    )
  }

  function prepareShoppingList() {
    setMessage(null)
    setIsError(false)

    startTransition(async () => {
      try {
        const result = await prepareWeeklyShoppingListAction(weekStart, {
          items: items.map((item) => ({
            inventoryItemId: item.inventoryItemId,
            inventoryQuantity: item.inventoryQuantity,
            shoppingQuantity: item.quantity,
          })),
        })

        if (!result.success) {
          setIsError(true)
          setMessage(result.message)
          return
        }

        setMessage(
          result.itemCount === 0
            ? "Inventario actualizado. No se ha añadido ningún producto a la lista."
            : `${result.itemCount} ${result.itemCount === 1 ? "producto preparado" : "productos preparados"} en la lista.`
        )
      } catch {
        setIsError(true)
        setMessage("No se han podido guardar los ajustes. Inténtalo de nuevo.")
      }
    })
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-2xl border border-[#c9dbc9] bg-[#e9f1e6] p-4 text-[#31523f] dark:border-[#42624a] dark:bg-[#263d2d] dark:text-[#d9eadb]">
        <p className="text-sm font-semibold">El menú no necesita productos</p>
        <p className="mt-1 text-xs leading-5 text-[#597161] dark:text-[#b9cebc]">
          Añade ingredientes a los platos para preparar la compra de esta
          semana.
        </p>
      </div>
    )
  }

  return (
    <details className="group overflow-hidden rounded-[1.75rem] border border-[#d8d7bd] bg-[#eeeddc] text-[#303b2d] shadow-[0_18px_50px_rgba(50,72,60,0.08)] dark:border-[#59624e] dark:bg-[#2e382b] dark:text-[#f4f3e7]">
      <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-4 p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#74794f] sm:p-5">
        <div>
          <p className="text-sm font-semibold">Vista previa de la compra</p>
          <p className="mt-1 text-xs text-[#69705b] dark:text-[#c0c7b5]">
            {items.length} {items.length === 1 ? "producto" : "productos"} por
            revisar
          </p>
        </div>
        <span
          className="grid size-8 shrink-0 place-items-center rounded-full bg-white/60 text-lg transition group-open:rotate-45 dark:bg-white/10"
          aria-hidden="true"
        >
          +
        </span>
      </summary>

      <div className="border-t border-[#d4d3b9] p-4 sm:p-5 dark:border-white/10">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a75938] dark:text-[#e99a77]">
            Compra de esta semana
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
            Ajusta inventario y compra
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#69705b] dark:text-[#c0c7b5]">
            Revisa lo que tienes en casa. Al cambiar el inventario
            recalcularemos lo que falta, pero también puedes ajustar manualmente
            cuánto comprar.
          </p>
        </div>

        <div
          className="mb-2 hidden grid-cols-[minmax(10rem,1fr)_repeat(3,minmax(7rem,0.55fr))] gap-3 px-3 text-xs font-bold uppercase tracking-[0.08em] text-[#69705b] lg:grid dark:text-[#c0c7b5]"
          aria-hidden="true"
        >
          <span>Producto</span>
          <span>Necesitas</span>
          <span>En inventario</span>
          <span>Añadir</span>
        </div>

        <ul className="grid gap-3">
          {items.map((item) => (
            <ShoppingListPreviewRow
              key={item.inventoryItemId}
              item={item}
              disabled={isPending}
              onInventoryQuantityChange={updateInventoryQuantity}
              onShoppingQuantityChange={updateShoppingQuantity}
            />
          ))}
        </ul>

        <div className="mt-5 border-t border-[#d4d3b9] pt-4 sm:flex sm:items-end sm:justify-between sm:gap-5 dark:border-white/10">
          <div className="min-h-5">
            {message ? (
              <p
                className={`text-sm font-semibold ${isError ? "text-[#a34435] dark:text-[#ffb4a4]" : "text-[#477052] dark:text-[#a9d6b4]"}`}
                role={isError ? "alert" : "status"}
              >
                {message}{" "}
                {!isError ? (
                  <Link
                    href="/shopping-list"
                    className="underline underline-offset-2"
                  >
                    Abrir lista
                  </Link>
                ) : null}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={prepareShoppingList}
            disabled={isPending}
            className="mt-4 inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-[#a75938] px-5 text-sm font-semibold text-white transition hover:bg-[#8f482d] focus:outline-none focus:ring-2 focus:ring-[#a75938] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-65 sm:mt-0 sm:w-auto dark:ring-offset-[#2e382b]"
          >
            {isPending ? "Guardando ajustes…" : "Actualizar y preparar lista"}
          </button>
        </div>
      </div>
    </details>
  )
}
