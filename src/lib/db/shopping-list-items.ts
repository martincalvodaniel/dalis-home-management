import "server-only";

import { ObjectId } from "mongodb";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import type {
	ShoppingListItem,
	ShoppingListItemInput,
} from "@/schemas/shopping-list-item";

interface ShoppingListItemDocument extends Omit<ShoppingListItem, "id"> {
	_id: ObjectId;
}

function toShoppingListItem(
	document: ShoppingListItemDocument,
): ShoppingListItem {
	return {
		id: document._id.toHexString(),
		name: document.name,
		quantity: document.quantity,
		unit: document.unit,
		isPurchased: document.isPurchased,
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};
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
