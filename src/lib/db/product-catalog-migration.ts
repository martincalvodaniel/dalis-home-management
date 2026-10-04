import "server-only";

import { MongoServerError, ObjectId } from "mongodb";
import type {
	MigrationProduct,
	ProductCatalogMigrationStore,
} from "@/lib/catalog/product-catalog-migration";
import { normalizeProductName } from "@/lib/catalog/product-name";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import type { InventoryItem } from "@/schemas/inventory-item";
import type { QuantityUnit } from "@/schemas/quantity-unit";

interface InventoryMigrationDocument {
	_id: ObjectId;
	name: string;
	quantity: number;
	unit: QuantityUnit;
	location: InventoryItem["location"];
	normalizedName?: string;
	createdAt: Date;
	updatedAt: Date;
}

interface IngredientMigrationDocument {
	id: string;
	name: string;
	quantity: number;
	unit: QuantityUnit;
	inventoryItemId?: ObjectId;
}

interface DishMigrationDocument {
	_id: ObjectId;
	ingredients: IngredientMigrationDocument[];
	updatedAt: Date;
}

interface ShoppingMigrationDocument {
	_id: ObjectId;
	name: string;
	unit: QuantityUnit;
	inventoryItemId?: ObjectId;
	mealPlanIngredientKey?: string;
	updatedAt: Date;
}

function toMigrationProduct(
	document: InventoryMigrationDocument,
): MigrationProduct {
	return {
		id: document._id.toHexString(),
		name: document.name,
		unit: document.unit,
		normalizedName: document.normalizedName,
	};
}

export function createMongoProductCatalogMigrationStore(): ProductCatalogMigrationStore {
	return {
		async listProducts() {
			const collection = await getCollection<InventoryMigrationDocument>(
				COLLECTION_NAMES.inventoryItems,
			);
			return (await collection.find({}).toArray()).map(toMigrationProduct);
		},
		async setProductNormalizedName(id, normalizedName) {
			const collection = await getCollection<InventoryMigrationDocument>(
				COLLECTION_NAMES.inventoryItems,
			);
			await collection.updateOne(
				{ _id: new ObjectId(id) },
				{ $set: { normalizedName } },
			);
		},
		async createProduct(name, unit) {
			const collection = await getCollection<InventoryMigrationDocument>(
				COLLECTION_NAMES.inventoryItems,
			);
			const now = new Date();
			const document: InventoryMigrationDocument = {
				_id: new ObjectId(),
				name,
				normalizedName: normalizeProductName(name),
				quantity: 0,
				unit,
				location: "other",
				createdAt: now,
				updatedAt: now,
			};
			await collection.insertOne(document);
			return toMigrationProduct(document);
		},
		async listLegacyIngredients() {
			const collection = await getCollection<DishMigrationDocument>(
				COLLECTION_NAMES.dishes,
			);
			const documents = await collection
				.find({
					ingredients: { $elemMatch: { inventoryItemId: { $exists: false } } },
				})
				.toArray();

			return documents.flatMap((document) =>
				document.ingredients
					.filter((ingredient) => !ingredient.inventoryItemId)
					.map((ingredient) => ({
						id: ingredient.id,
						dishId: document._id.toHexString(),
						name: ingredient.name,
						unit: ingredient.unit,
					})),
			);
		},
		async linkIngredient(reference, product) {
			const collection = await getCollection<DishMigrationDocument>(
				COLLECTION_NAMES.dishes,
			);
			const result = await collection.updateOne(
				{
					_id: new ObjectId(reference.dishId),
					ingredients: {
						$elemMatch: {
							id: reference.id,
							inventoryItemId: { $exists: false },
						},
					},
				},
				{
					$set: {
						"ingredients.$.inventoryItemId": new ObjectId(product.id),
						"ingredients.$.name": product.name,
						"ingredients.$.unit": product.unit,
						updatedAt: new Date(),
					},
				},
			);
			return result.modifiedCount > 0;
		},
		async listLegacyShoppingItems() {
			const collection = await getCollection<ShoppingMigrationDocument>(
				COLLECTION_NAMES.shoppingListItems,
			);
			const documents = await collection
				.find({ inventoryItemId: { $exists: false } })
				.toArray();
			return documents.map((document) => ({
				id: document._id.toHexString(),
				name: document.name,
				unit: document.unit,
			}));
		},
		async hasLinkedShoppingItem(itemId, productId) {
			const collection = await getCollection<ShoppingMigrationDocument>(
				COLLECTION_NAMES.shoppingListItems,
			);
			return (
				(await collection.findOne({
					_id: { $ne: new ObjectId(itemId) },
					inventoryItemId: new ObjectId(productId),
				})) !== null
			);
		},
		async linkShoppingItem(reference, product) {
			const collection = await getCollection<ShoppingMigrationDocument>(
				COLLECTION_NAMES.shoppingListItems,
			);
			try {
				const result = await collection.updateOne(
					{
						_id: new ObjectId(reference.id),
						inventoryItemId: { $exists: false },
					},
					{
						$set: {
							inventoryItemId: new ObjectId(product.id),
							name: product.name,
							unit: product.unit,
							updatedAt: new Date(),
						},
						$unset: { mealPlanIngredientKey: "" },
					},
				);
				return result.modifiedCount > 0;
			} catch (error) {
				if (error instanceof MongoServerError && error.code === 11000) {
					return false;
				}
				throw error;
			}
		},
	};
}
