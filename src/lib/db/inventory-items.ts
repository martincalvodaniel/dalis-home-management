import "server-only";

import { ObjectId } from "mongodb";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import type {
	InventoryItem,
	InventoryItemInput,
} from "@/schemas/inventory-item";

interface InventoryItemDocument extends Omit<InventoryItem, "id"> {
	_id: ObjectId;
}

function toInventoryItem(document: InventoryItemDocument): InventoryItem {
	return {
		id: document._id.toHexString(),
		name: document.name,
		quantity: document.quantity,
		unit: document.unit,
		location: document.location,
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};
}

function toObjectId(id: string): ObjectId {
	return new ObjectId(id);
}

export async function listInventoryItems(): Promise<InventoryItem[]> {
	const collection = await getCollection<InventoryItemDocument>(
		COLLECTION_NAMES.inventoryItems,
	);
	const documents = await collection
		.find({})
		.sort({ location: 1, name: 1 })
		.collation({ locale: "es", strength: 1 })
		.toArray();

	return documents.map(toInventoryItem);
}

export async function createInventoryItem(
	input: InventoryItemInput,
): Promise<string> {
	const collection = await getCollection<InventoryItemDocument>(
		COLLECTION_NAMES.inventoryItems,
	);
	const now = new Date();
	const result = await collection.insertOne({
		_id: new ObjectId(),
		...input,
		createdAt: now,
		updatedAt: now,
	});

	return result.insertedId.toHexString();
}

export async function updateInventoryItem(
	id: string,
	input: InventoryItemInput,
): Promise<boolean> {
	const collection = await getCollection<InventoryItemDocument>(
		COLLECTION_NAMES.inventoryItems,
	);
	const result = await collection.updateOne(
		{ _id: toObjectId(id) },
		{ $set: { ...input, updatedAt: new Date() } },
	);

	return result.matchedCount > 0;
}

export async function markInventoryItemOutOfStock(
	id: string,
): Promise<boolean> {
	const collection = await getCollection<InventoryItemDocument>(
		COLLECTION_NAMES.inventoryItems,
	);
	const result = await collection.updateOne(
		{ _id: toObjectId(id) },
		{ $set: { quantity: 0, updatedAt: new Date() } },
	);

	return result.matchedCount > 0;
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
	const collection = await getCollection<InventoryItemDocument>(
		COLLECTION_NAMES.inventoryItems,
	);
	const result = await collection.deleteOne({ _id: toObjectId(id) });

	return result.deletedCount > 0;
}
