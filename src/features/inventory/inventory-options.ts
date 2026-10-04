import type { InventoryItem } from "@/schemas/inventory-item"

export {
  quantityUnitLabels as inventoryUnitLabels,
  quantityUnitShortLabels as inventoryUnitShortLabels,
} from "@/config/quantity-units"

export const inventoryLocationLabels: Record<
  InventoryItem["location"],
  string
> = {
  pantry: "Despensa",
  fridge: "Nevera",
  freezer: "Congelador",
  household: "Hogar",
  other: "Otro",
}
