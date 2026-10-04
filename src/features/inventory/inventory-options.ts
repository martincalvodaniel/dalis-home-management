import type { InventoryItem } from "@/schemas/inventory-item";

export const inventoryUnitLabels: Record<InventoryItem["unit"], string> = {
	unit: "unidades",
	gram: "gramos",
	kilogram: "kilogramos",
	milliliter: "mililitros",
	liter: "litros",
};

export const inventoryUnitShortLabels: Record<InventoryItem["unit"], string> = {
	unit: "uds.",
	gram: "g",
	kilogram: "kg",
	milliliter: "ml",
	liter: "l",
};

export const inventoryLocationLabels: Record<
	InventoryItem["location"],
	string
> = {
	pantry: "Despensa",
	fridge: "Nevera",
	freezer: "Congelador",
	household: "Hogar",
	other: "Otro",
};
