import type { InventoryItem } from "@/schemas/inventory-item";

export type CatalogProductOption = Pick<
	InventoryItem,
	"id" | "name" | "unit" | "location"
>;

export function toCatalogProductOption(
	item: InventoryItem,
): CatalogProductOption {
	return {
		id: item.id,
		name: item.name,
		unit: item.unit,
		location: item.location,
	};
}
