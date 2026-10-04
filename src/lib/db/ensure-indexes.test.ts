import "server-only";

import { describe, expect, test } from "bun:test";
import type { IndexSpec } from "./ensure-indexes";
import {
	ensureIndexes,
	INDEX_SPECS,
	type IndexDatabase,
	validateIndexSpecs,
} from "./ensure-indexes";

describe("MongoDB index specifications", () => {
	test("the application index registry is valid", () => {
		expect(() => validateIndexSpecs(INDEX_SPECS)).not.toThrow();
	});

	test("registers the inventory list sort index", () => {
		expect(INDEX_SPECS).toContainEqual({
			collection: "inventory_items",
			keys: { location: 1, name: 1 },
			options: {
				name: "location_asc_name_asc",
				collation: { locale: "es", strength: 1 },
			},
		});
	});

	test("registers the shopping list sort index", () => {
		expect(INDEX_SPECS).toContainEqual({
			collection: "shopping_list_items",
			keys: { isPurchased: 1, createdAt: 1 },
			options: { name: "is_purchased_asc_created_at_asc" },
		});
	});

	test("registers the unique inventory shopping-list link", () => {
		expect(INDEX_SPECS).toContainEqual({
			collection: "shopping_list_items",
			keys: { inventoryItemId: 1 },
			options: {
				name: "inventory_item_id_unique",
				unique: true,
				partialFilterExpression: { inventoryItemId: { $type: "objectId" } },
			},
		});
	});

	test("rejects duplicate names within a collection", () => {
		const specs: IndexSpec[] = [
			{
				collection: "items",
				keys: { createdAt: -1 },
				options: { name: "created_at_desc" },
			},
			{
				collection: "items",
				keys: { updatedAt: -1 },
				options: { name: "created_at_desc" },
			},
		];

		expect(() => validateIndexSpecs(specs)).toThrow(
			"Duplicate MongoDB index name: items.created_at_desc",
		);
	});

	test("allows the same index name in different collections", () => {
		const specs: IndexSpec[] = [
			{
				collection: "items",
				keys: { createdAt: -1 },
				options: { name: "created_at_desc" },
			},
			{
				collection: "tasks",
				keys: { createdAt: -1 },
				options: { name: "created_at_desc" },
			},
		];

		expect(() => validateIndexSpecs(specs)).not.toThrow();
	});

	test("creates every registered index with its options", async () => {
		const calls: Array<{ collection: string; name: string }> = [];
		const database: IndexDatabase = {
			collection: (collection) => ({
				createIndex: async (_keys, options) => {
					calls.push({ collection, name: options?.name ?? "" });
					return options?.name ?? "";
				},
			}),
		};
		const specs: IndexSpec[] = [
			{
				collection: "items",
				keys: { createdAt: -1 },
				options: { name: "created_at_desc" },
			},
			{
				collection: "tasks",
				keys: { ownerId: 1, dueAt: 1 },
				options: { name: "owner_id_asc_due_at_asc" },
			},
		];

		await ensureIndexes(database, specs);

		expect(calls).toEqual([
			{ collection: "items", name: "created_at_desc" },
			{ collection: "tasks", name: "owner_id_asc_due_at_asc" },
		]);
	});
});
