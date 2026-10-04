import { describe, expect, test } from "bun:test";
import { inventoryItemInputSchema } from "@/schemas/inventory-item";

describe("inventoryItemInputSchema", () => {
	test("normalizes a valid inventory item", () => {
		const result = inventoryItemInputSchema.parse({
			name: "  Olive oil  ",
			quantity: 1.5,
			unit: "liter",
			location: "pantry",
		});

		expect(result).toEqual({
			name: "Olive oil",
			quantity: 1.5,
			unit: "liter",
			location: "pantry",
		});
	});

	test("accepts zero quantity for out-of-stock items", () => {
		const result = inventoryItemInputSchema.safeParse({
			name: "Coffee",
			quantity: 0,
			unit: "gram",
			location: "pantry",
		});

		expect(result.success).toBe(true);
	});

	test("rejects negative quantities", () => {
		const result = inventoryItemInputSchema.safeParse({
			name: "Coffee",
			quantity: -1,
			unit: "gram",
			location: "pantry",
		});

		expect(result.success).toBe(false);
	});

	test("rejects unsupported units and locations", () => {
		const result = inventoryItemInputSchema.safeParse({
			name: "Coffee",
			quantity: 1,
			unit: "box",
			location: "garage",
		});

		expect(result.success).toBe(false);
	});
});
