import type { Dish } from "@/schemas/dish";
import type { InventoryItem } from "@/schemas/inventory-item";
import type { QuantityUnit } from "@/schemas/quantity-unit";
import type { WeeklyMealPlan } from "@/schemas/weekly-meal-plan";

interface ShoppingListSuggestionBase {
	name: string;
	quantity: number;
	unit: QuantityUnit;
}

export type ShoppingListSuggestion = ShoppingListSuggestionBase &
	(
		| { inventoryItemId: string; mealPlanIngredientKey?: never }
		| { inventoryItemId?: never; mealPlanIngredientKey: string }
	);

interface IngredientTotal {
	name: string;
	quantity: number;
	unit: QuantityUnit;
	inventoryItemId?: string;
}

function normalizeIngredientName(name: string): string {
	return name.trim().toLocaleLowerCase("es");
}

function roundQuantity(quantity: number): number {
	return Math.round(quantity * 1_000_000) / 1_000_000;
}

export function buildMealPlanShoppingSuggestions(
	mealPlan: WeeklyMealPlan,
	dishes: Dish[],
	inventoryItems: InventoryItem[],
): ShoppingListSuggestion[] {
	const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));
	const inventoryById = new Map(inventoryItems.map((item) => [item.id, item]));
	const totals = new Map<string, IngredientTotal>();

	for (const slot of mealPlan.slots) {
		const dish = dishesById.get(slot.dishId);
		if (!dish) {
			continue;
		}

		for (const ingredient of dish.ingredients) {
			const linkedInventory = ingredient.inventoryItemId
				? inventoryById.get(ingredient.inventoryItemId)
				: undefined;
			const normalizedName = normalizeIngredientName(ingredient.name);
			const key = linkedInventory
				? `inventory:${linkedInventory.id}`
				: `ingredient:${normalizedName}:${ingredient.unit}`;
			const current = totals.get(key);

			totals.set(key, {
				name: linkedInventory?.name ?? current?.name ?? ingredient.name.trim(),
				quantity: (current?.quantity ?? 0) + ingredient.quantity,
				unit: linkedInventory?.unit ?? ingredient.unit,
				...(linkedInventory ? { inventoryItemId: linkedInventory.id } : {}),
			});
		}
	}

	const suggestions: ShoppingListSuggestion[] = [];
	for (const [key, total] of totals) {
		const availableQuantity = total.inventoryItemId
			? (inventoryById.get(total.inventoryItemId)?.quantity ?? 0)
			: 0;
		const missingQuantity = roundQuantity(total.quantity - availableQuantity);

		if (missingQuantity <= 0) {
			continue;
		}

		suggestions.push({
			name: total.name,
			quantity: missingQuantity,
			unit: total.unit,
			...(total.inventoryItemId
				? { inventoryItemId: total.inventoryItemId }
				: { mealPlanIngredientKey: key }),
		});
	}

	return suggestions;
}
