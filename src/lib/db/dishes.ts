import "server-only";

import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import { findInventoryItemsByIds } from "@/lib/db/inventory-items";
import type { Dish, DishIngredient, DishInput } from "@/schemas/dish";
import type { InventoryItem } from "@/schemas/inventory-item";

interface DishIngredientDocument
	extends Omit<DishIngredient, "inventoryItemId"> {
	inventoryItemId?: ObjectId;
}

interface DishDocument extends Omit<Dish, "id" | "ingredients"> {
	_id: ObjectId;
	ingredients: DishIngredientDocument[];
}

function toIngredient(
	document: DishIngredientDocument,
	inventoryItemsById: ReadonlyMap<string, InventoryItem>,
): DishIngredient {
	const inventoryItemId = document.inventoryItemId?.toHexString();
	const inventoryItem = inventoryItemId
		? inventoryItemsById.get(inventoryItemId)
		: undefined;
	const ingredient: DishIngredient = {
		id: document.id,
		name: inventoryItem?.name ?? document.name,
		quantity: document.quantity,
		unit: inventoryItem?.unit ?? document.unit,
	};

	if (inventoryItemId) {
		ingredient.inventoryItemId = inventoryItemId;
	}

	return ingredient;
}

function toIngredientDocument(
	ingredient: DishInput["ingredients"][number],
): DishIngredientDocument {
	const document: DishIngredientDocument = {
		id: randomUUID(),
		name: ingredient.name,
		quantity: ingredient.quantity,
		unit: ingredient.unit,
	};

	if (ingredient.inventoryItemId) {
		document.inventoryItemId = new ObjectId(ingredient.inventoryItemId);
	}

	return document;
}

function toDish(
	document: DishDocument,
	inventoryItemsById: ReadonlyMap<string, InventoryItem>,
): Dish {
	return {
		id: document._id.toHexString(),
		name: document.name,
		ingredients: document.ingredients.map((ingredient) =>
			toIngredient(ingredient, inventoryItemsById),
		),
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};
}

async function loadInventoryItemsById(
	documents: readonly DishDocument[],
): Promise<Map<string, InventoryItem>> {
	const ids = documents.flatMap((document) =>
		document.ingredients.flatMap((ingredient) =>
			ingredient.inventoryItemId
				? [ingredient.inventoryItemId.toHexString()]
				: [],
		),
	);
	const inventoryItems = await findInventoryItemsByIds(ids);

	return new Map(inventoryItems.map((item) => [item.id, item]));
}

function toObjectId(id: string): ObjectId {
	return new ObjectId(id);
}

export async function listDishes(): Promise<Dish[]> {
	const collection = await getCollection<DishDocument>(COLLECTION_NAMES.dishes);
	const documents = await collection
		.find({})
		.sort({ name: 1 })
		.collation({ locale: "es", strength: 1 })
		.toArray();
	const inventoryItemsById = await loadInventoryItemsById(documents);

	return documents.map((document) => toDish(document, inventoryItemsById));
}

export async function findDishById(id: string): Promise<Dish | null> {
	const collection = await getCollection<DishDocument>(COLLECTION_NAMES.dishes);
	const document = await collection.findOne({ _id: toObjectId(id) });

	if (!document) {
		return null;
	}

	const inventoryItemsById = await loadInventoryItemsById([document]);
	return toDish(document, inventoryItemsById);
}

export async function isInventoryItemUsedInDishes(
	inventoryItemId: string,
): Promise<boolean> {
	const collection = await getCollection<DishDocument>(COLLECTION_NAMES.dishes);
	const document = await collection.findOne(
		{ "ingredients.inventoryItemId": toObjectId(inventoryItemId) },
		{ projection: { _id: 1 } },
	);

	return document !== null;
}

export async function createDish(input: DishInput): Promise<string> {
	const collection = await getCollection<DishDocument>(COLLECTION_NAMES.dishes);
	const now = new Date();
	const result = await collection.insertOne({
		_id: new ObjectId(),
		name: input.name,
		ingredients: input.ingredients.map(toIngredientDocument),
		createdAt: now,
		updatedAt: now,
	});

	return result.insertedId.toHexString();
}

export async function updateDish(
	id: string,
	input: DishInput,
): Promise<boolean> {
	const collection = await getCollection<DishDocument>(COLLECTION_NAMES.dishes);
	const result = await collection.updateOne(
		{ _id: toObjectId(id) },
		{
			$set: {
				name: input.name,
				ingredients: input.ingredients.map(toIngredientDocument),
				updatedAt: new Date(),
			},
		},
	);

	return result.matchedCount > 0;
}

export async function deleteDish(id: string): Promise<boolean> {
	const collection = await getCollection<DishDocument>(COLLECTION_NAMES.dishes);
	const result = await collection.deleteOne({ _id: toObjectId(id) });

	return result.deletedCount > 0;
}
