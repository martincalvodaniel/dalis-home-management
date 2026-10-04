import "server-only";

import { ObjectId } from "mongodb";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import { buildInventoryShoppingListUpdate } from "@/lib/db/shopping-list-item-update";
import type { InventoryItem } from "@/schemas/inventory-item";
import type {
	ShoppingListItem,
	ShoppingListItemInput,
} from "@/schemas/shopping-list-item";

interface ShoppingListItemDocument
	extends Omit<ShoppingListItem, "id" | "inventoryItemId"> {
	_id: ObjectId;
	inventoryItemId?: ObjectId;
}

function toShoppingListItem(
	document: ShoppingListItemDocument,
): ShoppingListItem {
	const item: ShoppingListItem = {
		id: document._id.toHexString(),
		name: document.name,
		quantity: document.quantity,
		unit: document.unit,
		isPurchased: document.isPurchased,
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};

	if (document.inventoryItemId) {
		item.inventoryItemId = document.inventoryItemId.toHexString();
	}

	return item;
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

	return documents.map(toShoppingListItem);
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

export async function updateShoppingListItem(
	id: string,
	input: ShoppingListItemInput,
): Promise<boolean> {
	const collection = await getCollection<ShoppingListItemDocument>(
		COLLECTION_NAMES.shoppingListItems,
	);
	const result = await collection.updateOne(
		{ _id: toObjectId(id) },
		{ $set: { ...input, updatedAt: new Date() } },
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
