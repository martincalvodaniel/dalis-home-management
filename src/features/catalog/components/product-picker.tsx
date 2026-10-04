"use client"

import { SelectField } from "@/components/ui/select-field"
import { quantityUnitShortLabels } from "@/config/quantity-units"
import type { CatalogProductOption } from "@/features/catalog/product-option"
import { inventoryLocationLabels } from "@/features/inventory/inventory-options"

interface ProductPickerProps {
  id: string
  products: readonly CatalogProductOption[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function ProductPicker({
  id,
  products,
  value,
  onValueChange,
  disabled = false,
  className,
}: ProductPickerProps) {
  const options = [
    { value: "", label: "Selecciona un producto" },
    ...products.map((product) => ({
      value: product.id,
      label: `${product.name} · ${quantityUnitShortLabels[product.unit]} · ${inventoryLocationLabels[product.location]}`,
    })),
  ]

  return (
    <SelectField
      id={id}
      value={value}
      onValueChange={onValueChange}
      options={options}
      disabled={disabled}
      className={className}
    />
  )
}
