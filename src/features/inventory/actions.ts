"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import {
	createInventoryItem,
	deleteInventoryItem,
	markInventoryItemOutOfStock,
	updateInventoryItem,
} from "@/lib/db/inventory-items";
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

	const deleted = await deleteInventoryItem(result.data);
	if (!deleted) {
		return { success: false, message: "No se ha encontrado el producto." };
	}

	revalidatePath(INVENTORY_PATH);
	return { success: true };
}
