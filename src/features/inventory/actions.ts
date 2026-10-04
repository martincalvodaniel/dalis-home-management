"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import { isInventoryItemUsedInDishes } from "@/lib/db/dishes";
import {
	createInventoryItem,
	deleteInventoryItem,
	markInventoryItemOutOfStock,
	updateInventoryItem,
} from "@/lib/db/inventory-items";
import { isInventoryItemUsedInShoppingList } from "@/lib/db/shopping-list-items";
import {
	inventoryItemIdSchema,
	inventoryItemInputSchema,
} from "@/schemas/inventory-item";

const INVENTORY_PATH = "/inventory";

type InventoryActionResult =
	| { success: true }
	| { success: false; message: string };

const invalidInputResult: InventoryActionResult = {
	success: false,
	message: "Revisa los datos del producto e inténtalo de nuevo.",
};

export async function createInventoryItemAction(
	input: unknown,
): Promise<InventoryActionResult> {
	await requireAuthorizedSession();
	const result = inventoryItemInputSchema.safeParse(input);

	if (!result.success) {
		return invalidInputResult;
	}

	await createInventoryItem(result.data);
	revalidatePath(INVENTORY_PATH);

	return { success: true };
}

export async function updateInventoryItemAction(
	id: unknown,
	input: unknown,
): Promise<InventoryActionResult> {
	await requireAuthorizedSession();
	const idResult = inventoryItemIdSchema.safeParse(id);
	const inputResult = inventoryItemInputSchema.safeParse(input);

	if (!idResult.success || !inputResult.success) {
		return invalidInputResult;
	}

	const updated = await updateInventoryItem(idResult.data, inputResult.data);
	if (!updated) {
		return { success: false, message: "No se ha encontrado el producto." };
	}

	revalidatePath(INVENTORY_PATH);
	return { success: true };
}

export async function markInventoryItemOutOfStockAction(
	id: unknown,
): Promise<InventoryActionResult> {
	await requireAuthorizedSession();
	const result = inventoryItemIdSchema.safeParse(id);

	if (!result.success) {
		return invalidInputResult;
	}

	const updated = await markInventoryItemOutOfStock(result.data);
	if (!updated) {
		return { success: false, message: "No se ha encontrado el producto." };
	}

	revalidatePath(INVENTORY_PATH);
	return { success: true };
}

export async function deleteInventoryItemAction(
	id: unknown,
): Promise<InventoryActionResult> {
	await requireAuthorizedSession();
	const result = inventoryItemIdSchema.safeParse(id);

	if (!result.success) {
		return invalidInputResult;
	}

	const [usedInDishes, usedInShoppingList] = await Promise.all([
		isInventoryItemUsedInDishes(result.data),
		isInventoryItemUsedInShoppingList(result.data),
	]);
	if (usedInDishes) {
		return {
			success: false,
			message:
				"Desvincula este producto de los platos del recetario antes de eliminarlo.",
		};
	}
	if (usedInShoppingList) {
		return {
			success: false,
			message: "Elimina primero este producto de la lista de la compra.",
		};
	}

	const deleted = await deleteInventoryItem(result.data);
	if (!deleted) {
		return { success: false, message: "No se ha encontrado el producto." };
	}

	revalidatePath(INVENTORY_PATH);
	return { success: true };
}
