import { describe, expect, test } from "bun:test";
import { shoppingListItemInputSchema } from "@/schemas/shopping-list-item";

describe("shoppingListItemInputSchema", () => {
	test("normalizes a valid shopping list item", () => {
		const result = shoppingListItemInputSchema.parse({
			name: "  Oat milk  ",
			quantity: 2,
			unit: "liter",
		});

		expect(result).toEqual({
			name: "Oat milk",
			quantity: 2,
			unit: "liter",
		});
	});

	test("rejects empty names", () => {
		const result = shoppingListItemInputSchema.safeParse({
			name: "   ",
			quantity: 1,
			unit: "unit",
		});

		expect(result.success).toBe(false);
	});

	test("rejects zero and negative quantities", () => {
		for (const quantity of [0, -1]) {
			const result = shoppingListItemInputSchema.safeParse({
				name: "Bread",
				quantity,
				unit: "unit",
			});

			expect(result.success).toBe(false);
		}
	});

	test("rejects unsupported units", () => {
		const result = shoppingListItemInputSchema.safeParse({
			name: "Eggs",
			quantity: 1,
			unit: "box",
		});

		expect(result.success).toBe(false);
	});

	test("keeps inventory links out of manual item input", () => {
		const result = shoppingListItemInputSchema.safeParse({
			name: "Eggs",
			quantity: 1,
			unit: "unit",
			inventoryItemId: "507f1f77bcf86cd799439011",
		});

		expect(result.success).toBe(false);
	});
});
