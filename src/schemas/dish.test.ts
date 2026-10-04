import { describe, expect, test } from "bun:test";
import { dishInputSchema } from "@/schemas/dish";

const validDish = {
	name: "  Lentil stew  ",
	ingredients: [
		{
			name: "  Lentils  ",
			quantity: 300,
			unit: "gram",
			inventoryItemId: "507f1f77bcf86cd799439011",
		},
		{
			name: "Carrot",
			quantity: 2,
			unit: "unit",
		},
	],
};

describe("dishInputSchema", () => {
	test("normalizes a valid dish and its ingredients", () => {
		const result = dishInputSchema.parse(validDish);

		expect(result.name).toBe("Lentil stew");
		expect(result.ingredients[0]?.name).toBe("Lentils");
		expect(result.ingredients).toHaveLength(2);
	});

	test("requires at least one ingredient", () => {
		const result = dishInputSchema.safeParse({
			name: "Empty dish",
			ingredients: [],
		});

		expect(result.success).toBe(false);
	});

	test("rejects duplicate ingredient names", () => {
		const result = dishInputSchema.safeParse({
			name: "Salad",
			ingredients: [
				{ name: "Tomato", quantity: 1, unit: "unit" },
				{ name: "tomato", quantity: 2, unit: "unit" },
			],
		});

		expect(result.success).toBe(false);
	});

	test("rejects malformed inventory links", () => {
		const result = dishInputSchema.safeParse({
			...validDish,
			ingredients: [
				{
					name: "Lentils",
					quantity: 300,
					unit: "gram",
					inventoryItemId: "not-an-object-id",
				},
			],
		});

		expect(result.success).toBe(false);
	});
});
