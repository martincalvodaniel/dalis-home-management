"use client"

import { useDeferredValue, useId, useState } from "react"
import { SelectField } from "@/components/ui/select-field"
import {
  getPurchasePlaces,
  normalizePurchasePlaceKey,
} from "@/features/catalog/purchase-places"
import type { InventoryItem } from "@/schemas/inventory-item"
import { InventoryItemCard } from "./inventory-item-card"

interface InventoryListProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
}

const diacriticPattern = /\p{Diacritic}/gu

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(diacriticPattern, "")
    .toLocaleLowerCase("es")
}

export function InventoryList({ items, onEdit }: InventoryListProps) {
  const listTitleId = useId()
  const searchInputId = useId()
  const purchasePlaceFilterId = useId()
  const [search, setSearch] = useState("")
  const [purchasePlace, setPurchasePlace] = useState("all")
  const deferredSearch = useDeferredValue(search)
  const normalizedSearch = normalizeSearchText(deferredSearch.trim())
  const purchasePlaceFilterOptions = [
    { value: "all", label: "Todos los lugares" },
    ...getPurchasePlaces(items).map((place) => ({
      value: place,
      label: place,
    })),
  ]
  const filteredItems = items.filter((item) => {
    const matchesPurchasePlace =
      purchasePlace === "all" ||
      item.purchasePlaces.some(
        (itemPurchasePlace) =>
          normalizePurchasePlaceKey(itemPurchasePlace) ===
          normalizePurchasePlaceKey(purchasePlace)
      )
    const matchesSearch =
      normalizedSearch.length === 0 ||
      normalizeSearchText(item.name).includes(normalizedSearch)

    return matchesPurchasePlace && matchesSearch
  })

  if (items.length === 0) {
    return (
      <section className="grid min-h-72 place-items-center rounded-[1.75rem] border border-dashed border-[#cbd4ca] bg-white/35 p-8 text-center dark:border-white/15 dark:bg-white/[0.025]">
        <div className="max-w-sm">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#dfe9dc] text-2xl dark:bg-[#254338]">
            <span aria-hidden="true">⌂</span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
            La casa está por estrenar
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#697970] dark:text-[#aebbb3]">
            Añade el primer producto para empezar a organizar lo que tenéis en
            casa.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby={listTitleId}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a8a81] dark:text-[#9baaa1]">
            En casa
          </p>
          <h2
            id={listTitleId}
            className="mt-1 text-2xl font-semibold tracking-[-0.04em]"
          >
            Nuestros productos
          </h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-[minmax(0,15rem)_minmax(0,11rem)]">
          <label className="sr-only" htmlFor={searchInputId}>
            Buscar productos
          </label>
          <input
            id={searchInputId}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar productos"
            className="min-h-11 w-full rounded-full border border-[#ccd5ca] bg-white/75 px-4 text-sm outline-none transition placeholder:text-[#8d9a92] focus:border-[#1d4f40] focus:ring-2 focus:ring-[#1d4f40]/15 dark:border-white/15 dark:bg-[#182e26]"
          />
          <div>
            <label className="sr-only" htmlFor={purchasePlaceFilterId}>
              Filtrar por lugar de compra
            </label>
            <SelectField
              id={purchasePlaceFilterId}
              value={purchasePlace}
              onValueChange={setPurchasePlace}
              options={purchasePlaceFilterOptions}
              className="min-h-11 rounded-full bg-white/75 text-sm dark:bg-[#182e26]"
            />
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-[#cbd4ca] bg-white/35 px-5 py-10 text-center dark:border-white/15 dark:bg-white/[0.025]">
          <p className="font-semibold">No hay productos que coincidan.</p>
          <p className="mt-1 text-sm text-[#697970] dark:text-[#aebbb3]">
            Prueba con otro nombre o lugar de compra.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <InventoryItemCard key={item.id} item={item} onEdit={onEdit} />
          ))}
        </div>
      )}
    </section>
  )
}
