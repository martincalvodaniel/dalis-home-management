import "server-only";

import { ObjectId } from "mongodb";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import { findInventoryItemsByIds } from "@/lib/db/inventory-items";
import { buildInventoryShoppingListUpdate } from "@/lib/db/shopping-list-item-update";
import type { InventoryItem } from "@/schemas/inventory-item";
import type { QuantityUnit } from "@/schemas/quantity-unit";
import type {
	ShoppingListItem,
	ShoppingListItemInput,
} from "@/schemas/shopping-list-item";

interface ShoppingListItemDocument
	extends Omit<
		ShoppingListItem,
		"id" | "inventoryItemId" | "isMealPlanGenerated"
	> {
	_id: ObjectId;
	inventoryItemId?: ObjectId;
	isMealPlanGenerated?: boolean;
	mealPlanIngredientKey?: string;
}

interface MealPlanShoppingListSuggestion {
	name: string;
	quantity: number;
	unit: QuantityUnit;
	inventoryItemId?: string;
	mealPlanIngredientKey?: string;
}

function toShoppingListItem(
	document: ShoppingListItemDocument,
	inventoryItemsById: ReadonlyMap<string, InventoryItem>,
): ShoppingListItem {
	const inventoryItemId = document.inventoryItemId?.toHexString();
	const inventoryItem = inventoryItemId
		? inventoryItemsById.get(inventoryItemId)
		: undefined;
	const item: ShoppingListItem = {
		id: document._id.toHexString(),
		name: inventoryItem?.name ?? document.name,
		quantity: document.quantity,
		unit: inventoryItem?.unit ?? document.unit,
		isMealPlanGenerated: document.isMealPlanGenerated ?? false,
		isPurchased: document.isPurchased,
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};

	if (inventoryItemId) {
		item.inventoryItemId = inventoryItemId;
	}

	return item;
}

async function loadInventoryItemsById(
	documents: readonly ShoppingListItemDocument[],
): Promise<Map<string, InventoryItem>> {
	const ids = documents.flatMap((document) =>
		document.inventoryItemId ? [document.inventoryItemId.toHexString()] : [],
	);
	const inventoryItems = await findInventoryItemsByIds(ids);

	return new Map(inventoryItems.map((item) => [item.id, item]));
}

function toObjectId(id: string): ObjectId {
	return new ObjectId(id);
}

export async function listShoppingListItems(): Promise<ShoppingListItem[]> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const documents = await collection
		.find({})
		.sort({ isPurchased: 1, createdAt: 1 })
		.toArray();
	const inventoryItemsById = await loadInventoryItemsById(documents);

	return documents.map((document) =>
		toShoppingListItem(document, inventoryItemsById),
	);
}

export async function findShoppingListItemById(
	id: string,
): Promise<ShoppingListItem | null> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const document = await collection.findOne({ _id: toObjectId(id) });

	if (!document) {
		return null;
	}

	const inventoryItemsById = await loadInventoryItemsById([document]);
	return toShoppingListItem(document, inventoryItemsById);
}

export async function isInventoryItemUsedInShoppingList(
	inventoryItemId: string,
): Promise<boolean> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const document = await collection.findOne(
		{ inventoryItemId: toObjectId(inventoryItemId) },
		{ projection: { _id: 1 } },
	);

	return document !== null;
}

export async function createShoppingListItem(
	input: ShoppingListItemInput,
): Promise<string> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const now = new Date();
	const result = await collection.insertOne({
		_id: new ObjectId(),
		...input,
		isMealPlanGenerated: false,
		isPurchased: false,
		createdAt: now,
		updatedAt: now,
	});

	return result.insertedId.toHexString();
}

export async function addInventoryItemToShoppingList(
	item: InventoryItem,
): Promise<void> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const inventoryItemId = toObjectId(item.id);
	const now = new Date();

	await collection.updateOne(
		{ inventoryItemId },
		buildInventoryShoppingListUpdate(item, inventoryItemId, now),
		{ upsert: true },
	);
}

export async function addMealPlanSuggestionsToShoppingList(
	suggestions: MealPlanShoppingListSuggestion[],
): Promise<void> {
	if (suggestions.length === 0) {
		return;
	}

	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const now = new Date();

	await collection.bulkWrite(
		suggestions.map((suggestion) => {
			const inventoryItemId = suggestion.inventoryItemId
				? new ObjectId(suggestion.inventoryItemId)
				: undefined;
			const filter = inventoryItemId
				? { inventoryItemId }
				: { mealPlanIngredientKey: suggestion.mealPlanIngredientKey };

			return {
				updateOne: {
					filter,
					update: [
						{
							$set: {
								name: suggestion.name,
								unit: suggestion.unit,
								quantity: {
									$cond: [
										{ $eq: ["$isPurchased", false] },
										{
											$max: [
												{ $ifNull: ["$quantity", 0] },
												suggestion.quantity,
											],
										},
										suggestion.quantity,
									],
								},
								...(inventoryItemId ? { inventoryItemId } : {}),
								...(suggestion.mealPlanIngredientKey
									? {
											mealPlanIngredientKey: suggestion.mealPlanIngredientKey,
										}
									: {}),
								isMealPlanGenerated: true,
								isPurchased: false,
								createdAt: { $ifNull: ["$createdAt", now] },
								updatedAt: now,
							},
						},
					],
					upsert: true,
				},
			};
		}),
	);
}

export async function updateShoppingListItem(
	id: string,
	input: ShoppingListItemInput,
): Promise<boolean> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const result = await collection.updateOne(
		{ _id: toObjectId(id) },
		{
			$set: {
				...input,
				isMealPlanGenerated: false,
				updatedAt: new Date(),
			},
			$unset: { mealPlanIngredientKey: "" },
		},
	);

	return result.matchedCount > 0;
}

export async function setShoppingListItemPurchased(
	id: string,
	isPurchased: boolean,
): Promise<boolean> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const result = await collection.updateOne(
		{ _id: toObjectId(id) },
		{ $set: { isPurchased, updatedAt: new Date() } },
	);

	return result.matchedCount > 0;
}

export async function markShoppingListItemPurchasedIfPending(
	id: string,
): Promise<boolean> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const result = await collection.updateOne(
		{ _id: toObjectId(id), isPurchased: false },
		{ $set: { isPurchased: true, updatedAt: new Date() } },
	);

	return result.modifiedCount > 0;
}

export async function deleteShoppingListItem(id: string): Promise<boolean> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const result = await collection.deleteOne({ _id: toObjectId(id) });

	return result.deletedCount > 0;
}

export async function deletePurchasedShoppingListItems(): Promise<number> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const result = await collection.deleteMany({ isPurchased: true });

	return result.deletedCount;
}
