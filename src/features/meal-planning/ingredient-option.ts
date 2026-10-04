import type { QuantityUnit } from "@/schemas/quantity-unit";

export interface InventoryIngredientOption {
	id: string;
	name: string;
	unit: QuantityUnit;
}
