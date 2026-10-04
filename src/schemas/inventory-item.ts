import { z } from "zod";
import { quantityUnits } from "@/schemas/quantity-unit";

export { quantityUnits as inventoryItemUnits } from "@/schemas/quantity-unit";

export const inventoryItemLocations = [
	"pantry",
	"fridge",
	"freezer",
	"household",
	"other",
] as const;

export const inventoryItemSchema = z.object({
	id: z.string().min(1),
	name: z.string().trim().min(1).max(120),
	quantity: z.number().finite().min(0).max(999_999),
	unit: z.enum(quantityUnits),
	location: z.enum(inventoryItemLocations),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const inventoryItemInputSchema = inventoryItemSchema
	.pick({
		name: true,
		quantity: true,
		unit: true,
		location: true,
	})
	.strict();

export const inventoryItemIdSchema = z.string().regex(/^[0-9a-f]{24}$/i);

export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type InventoryItemInput = z.infer<typeof inventoryItemInputSchema>;
