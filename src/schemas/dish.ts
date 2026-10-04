import { z } from "zod";
import { quantityUnitSchema } from "@/schemas/quantity-unit";

const objectIdSchema = z.string().regex(/^[0-9a-f]{24}$/i);

export const dishIngredientSchema = z.object({
	id: z.uuid(),
	name: z.string().trim().min(1).max(120),
	quantity: z.number().finite().positive().max(999_999),
	unit: quantityUnitSchema,
	inventoryItemId: objectIdSchema.optional(),
});

export const dishIngredientInputSchema = dishIngredientSchema
	.omit({ id: true })
	.strict();

export const dishSchema = z.object({
	id: objectIdSchema,
	name: z.string().trim().min(1).max(120),
	ingredients: z.array(dishIngredientSchema).min(1).max(30),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const dishInputSchema = z
	.object({
		name: dishSchema.shape.name,
		ingredients: z.array(dishIngredientInputSchema).min(1).max(30),
	})
	.strict()
	.superRefine((dish, context) => {
		const ingredientNames = new Set<string>();

		for (const [index, ingredient] of dish.ingredients.entries()) {
			const normalizedName = ingredient.name.toLocaleLowerCase("es");
			if (ingredientNames.has(normalizedName)) {
				context.addIssue({
					code: "custom",
					message: "Ingredient names must be unique within a dish",
					path: ["ingredients", index, "name"],
				});
			}

			ingredientNames.add(normalizedName);
		}
	});

export const dishIdSchema = objectIdSchema;

export type Dish = z.infer<typeof dishSchema>;
export type DishIngredient = z.infer<typeof dishIngredientSchema>;
export type DishInput = z.infer<typeof dishInputSchema>;
