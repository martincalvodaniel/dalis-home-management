import { describe, expect, test } from "bun:test";
import {
	type LegacyIngredientReference,
	type LegacyReference,
	type MigrationProduct,
	migrateProductCatalogReferences,
	type ProductCatalogMigrationStore,
} from "@/lib/catalog/product-catalog-migration";
import type { QuantityUnit } from "@/schemas/quantity-unit";

class FakeMigrationStore implements ProductCatalogMigrationStore {
	products: MigrationProduct[];
	ingredients: LegacyIngredientReference[];
	shoppingItems: LegacyReference[];
	linkedShoppingProductIds = new Set<string>();
	linkedIngredients: Array<{ referenceId: string; productId: string }> = [];
	linkedShoppingItems: Array<{ referenceId: string; productId: string }> = [];

	constructor({
		products = [],
		ingredients = [],
		shoppingItems = [],
	}: {
		products?: MigrationProduct[];
		ingredients?: LegacyIngredientReference[];
		shoppingItems?: LegacyReference[];
	}) {
		this.products = products;
		this.ingredients = ingredients;
		this.shoppingItems = shoppingItems;
	}

	async listProducts() {
		return this.products;
	}

	async setProductNormalizedName(id: string, normalizedName: string) {
		this.products = this.products.map((product) =>
			product.id === id ? { ...product, normalizedName } : product,
		);
	}

	async createProduct(name: string, unit: QuantityUnit) {
		const product: MigrationProduct = {
			id: `created-${this.products.length + 1}`,
			name,
			unit,
			normalizedName: name.trim().toLocaleLowerCase("es"),
		};
		this.products.push(product);
		return product;
	}

	async listLegacyIngredients() {
		return this.ingredients;
	}

	async linkIngredient(
		reference: LegacyIngredientReference,
		product: MigrationProduct,
	) {
		this.ingredients = this.ingredients.filter(
			(ingredient) => ingredient.id !== reference.id,
		);
		this.linkedIngredients.push({
			referenceId: reference.id,
			productId: product.id,
		});
		return true;
	}

	async listLegacyShoppingItems() {
		return this.shoppingItems;
	}

	async hasLinkedShoppingItem(_itemId: string, productId: string) {
		return this.linkedShoppingProductIds.has(productId);
	}

	async linkShoppingItem(
		reference: LegacyReference,
		product: MigrationProduct,
	) {
		this.shoppingItems = this.shoppingItems.filter(
			(item) => item.id !== reference.id,
		);
		this.linkedShoppingProductIds.add(product.id);
		this.linkedShoppingItems.push({
			referenceId: reference.id,
			productId: product.id,
		});
		return true;
	}
}

describe("product catalog migration", () => {
	test("normalizes products, reuses exact matches, and creates missing products", async () => {
		const store = new FakeMigrationStore({
			products: [{ id: "rice", name: "  Rice ", unit: "gram" }],
			ingredients: [
				{
					id: "ingredient-rice",
					dishId: "dish-1",
					name: "rice",
					unit: "gram",
				},
				{
					id: "ingredient-tomato",
					dishId: "dish-1",
					name: "Tomato",
					unit: "unit",
				},
			],
			shoppingItems: [
				{ id: "shopping-tomato", name: " tomato ", unit: "unit" },
			],
		});

		const report = await migrateProductCatalogReferences(store);

		expect(report).toEqual({
			normalizedProducts: 1,
			createdProducts: 1,
			linkedIngredients: 2,
			linkedShoppingItems: 1,
			issues: [],
		});
		expect(store.linkedIngredients).toEqual([
			{ referenceId: "ingredient-rice", productId: "rice" },
			{ referenceId: "ingredient-tomato", productId: "created-2" },
		]);
		expect(store.linkedShoppingItems).toEqual([
			{ referenceId: "shopping-tomato", productId: "created-2" },
		]);

		expect(await migrateProductCatalogReferences(store)).toEqual({
			normalizedProducts: 0,
			createdProducts: 0,
			linkedIngredients: 0,
			linkedShoppingItems: 0,
			issues: [],
		});
	});

	test("reports ambiguous products and shopping-list collisions", async () => {
		const store = new FakeMigrationStore({
			products: [
				{
					id: "oil-1",
					name: "Oil",
					unit: "milliliter",
					normalizedName: "oil",
				},
				{
					id: "oil-2",
					name: "oil",
					unit: "milliliter",
					normalizedName: "oil",
				},
				{
					id: "bread",
					name: "Bread",
					unit: "unit",
					normalizedName: "bread",
				},
			],
			ingredients: [
				{
					id: "ingredient-oil",
					dishId: "dish-1",
					name: "OIL",
					unit: "milliliter",
				},
			],
			shoppingItems: [{ id: "shopping-bread", name: "Bread", unit: "unit" }],
		});
		store.linkedShoppingProductIds.add("bread");

		const report = await migrateProductCatalogReferences(store);

		expect(report.linkedIngredients).toBe(0);
		expect(report.linkedShoppingItems).toBe(0);
		expect(report.issues).toEqual([
			{
				kind: "ingredient",
				referenceId: "ingredient-oil",
				name: "OIL",
				unit: "milliliter",
				reason: "ambiguous-product",
			},
			{
				kind: "shopping-list",
				referenceId: "shopping-bread",
				name: "Bread",
				unit: "unit",
				reason: "shopping-list-collision",
			},
		]);
	});
});
