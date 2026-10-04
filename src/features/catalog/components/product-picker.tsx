"use client"

import { useId, useState } from "react"
import { SelectField } from "@/components/ui/select-field"
import { quantityUnitShortLabels } from "@/config/quantity-units"
import type { CatalogProductOption } from "@/features/catalog/product-option"

interface ProductPickerProps {
  id: string
  products: readonly CatalogProductOption[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
  searchable?: boolean
  showPurchasePlaces?: boolean
}

const diacriticPattern = /\p{Diacritic}/gu

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(diacriticPattern, "")
    .toLocaleLowerCase("es")
}

export function ProductPicker({
  id,
  products,
  value,
  onValueChange,
  disabled = false,
  className,
  searchable = false,
  showPurchasePlaces = true,
}: ProductPickerProps) {
  const searchId = useId()
  const [search, setSearch] = useState("")
  const normalizedSearch = normalizeSearch(search.trim())
  const visibleProducts = products.filter(
    (product) =>
      product.id === value ||
      normalizedSearch.length === 0 ||
      normalizeSearch(product.name).includes(normalizedSearch)
  )
  const options = [
    { value: "", label: "Selecciona un producto" },
    ...visibleProducts.map((product) => ({
      value: product.id,
      label: `${product.name} · ${quantityUnitShortLabels[product.unit]}${showPurchasePlaces && product.purchasePlaces.length > 0 ? ` · ${product.purchasePlaces.join(", ")}` : ""}`,
    })),
  ]

  return (
    <div className={searchable ? "mt-2 space-y-2" : undefined}>
      {searchable ? (
        <div>
          <label className="sr-only" htmlFor={searchId}>
            Buscar producto
          </label>
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            disabled={disabled}
            placeholder="Escribe para buscar"
            className="min-h-11 w-full rounded-xl border border-[#d8c5b8] bg-white/85 px-3 text-sm font-normal outline-none transition placeholder:text-[#9b887e] focus:border-[#a75938] focus:ring-2 focus:ring-[#a75938]/15 disabled:opacity-60 dark:border-white/15 dark:bg-[#2e211c]"
          />
        </div>
      ) : null}
      <SelectField
        id={id}
        value={value}
        onValueChange={onValueChange}
        options={options}
        disabled={disabled}
        className={className}
      />
      {searchable && visibleProducts.length === 0 ? (
        <p className="text-xs font-medium text-[#8f5140]">
          No hay productos que coincidan.
        </p>
      ) : null}
    </div>
  )
}
