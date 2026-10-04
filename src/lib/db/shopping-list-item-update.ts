import "server-only";

import type { Document, ObjectId } from "mongodb";
import type { InventoryItem } from "@/schemas/inventory-item";

export function buildInventoryShoppingListUpdate(
	item: InventoryItem,
	inventoryItemId: ObjectId,
	now: Date,
): Document[] {
	return [
		{
			$set: {
				inventoryItemId,
				name: item.name,
				unit: item.unit,
				quantity: {
					$cond: [
						{ $eq: ["$isPurchased", false] },
						{ $add: [{ $ifNull: ["$quantity", 0] }, 1] },
						1,
					],
				},
				isPurchased: false,
				createdAt: { $ifNull: ["$createdAt", now] },
				updatedAt: now,
			},
		},
	];
}
