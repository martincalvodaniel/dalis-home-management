"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import {
	findInventoryItemById,
	increaseInventoryItemQuantity,
} from "@/lib/db/inventory-items";
import {
	addInventoryItemToShoppingList,
	deletePurchasedShoppingListItems,
	deleteShoppingListItem,
	findShoppingListItemById,
	markShoppingListItemPurchasedIfPending,
	setShoppingListItemPurchased,
	updateShoppingListItem,
} from "@/lib/db/shopping-list-items";
import { inventoryItemIdSchema } from "@/schemas/inventory-item";
import {
	shoppingListItemIdSchema,
	shoppingListItemInputSchema,
	shoppingListItemPurchasedSchema,
} from "@/schemas/shopping-list-item";

const SHOPPING_LIST_PATH = "/shopping-list";
const INVENTORY_PATH = "/inventory";

type ShoppingListActionResult =
	| { success: true }
	| { success: false; message: string };

const invalidInputResult: ShoppingListActionResult = {
	success: false,
	message: "Revisa los datos del producto e inténtalo de nuevo.",
};

export async function createShoppingListItemAction(
	input: unknown,
): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	const result = shoppingListItemInputSchema.safeParse(input);

	if (!result.success) {
		return invalidInputResult;
	}

	const item = await findInventoryItemById(result.data.inventoryItemId);
	if (!item) {
		return {
			success: false,
			message: "No se ha encontrado el producto del catálogo.",
		};
	}

	await addInventoryItemToShoppingList(item, result.data.quantity);
	revalidatePath(SHOPPING_LIST_PATH);
	return { success: true };
}

export async function addInventoryItemToShoppingListAction(
	id: unknown,
): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	const result = inventoryItemIdSchema.safeParse(id);

	if (!result.success) {
		return invalidInputResult;
	}

	const item = await findInventoryItemById(result.data);
	if (!item) {
		return {
			success: false,
			message: "No se ha encontrado el producto del inventario.",
		};
	}

	await addInventoryItemToShoppingList(item);
	revalidatePath(SHOPPING_LIST_PATH);

	return { success: true };
}

export async function updateShoppingListItemAction(
	id: unknown,
	input: unknown,
): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	const idResult = shoppingListItemIdSchema.safeParse(id);
	const inputResult = shoppingListItemInputSchema.safeParse(input);

	if (!idResult.success || !inputResult.success) {
		return invalidInputResult;
	}

	const item = await findInventoryItemById(inputResult.data.inventoryItemId);
	if (!item) {
		return {
			success: false,
			message: "No se ha encontrado el producto del catálogo.",
		};
	}

	const updateResult = await updateShoppingListItem(
		idResult.data,
		item,
		inputResult.data.quantity,
	);
	if (updateResult === "missing") {
		return { success: false, message: "No se ha encontrado el producto." };
	}
	if (updateResult === "duplicate") {
		return {
			success: false,
			message: "Ese producto ya está en la lista de la compra.",
		};
	}

	revalidatePath(SHOPPING_LIST_PATH);
	return { success: true };
}

export async function setShoppingListItemPurchasedAction(
	id: unknown,
	isPurchased: unknown,
): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	const idResult = shoppingListItemIdSchema.safeParse(id);
	const purchasedResult =
		shoppingListItemPurchasedSchema.safeParse(isPurchased);

	if (!idResult.success || !purchasedResult.success) {
		return invalidInputResult;
	}

	const updated = await setShoppingListItemPurchased(
		idResult.data,
		purchasedResult.data,
	);
	if (!updated) {
		return { success: false, message: "No se ha encontrado el producto." };
	}

	revalidatePath(SHOPPING_LIST_PATH);
	return { success: true };
}

export async function purchaseShoppingListItemAndRestockAction(
	id: unknown,
): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	const result = shoppingListItemIdSchema.safeParse(id);

	if (!result.success) {
		return invalidInputResult;
	}

	const item = await findShoppingListItemById(result.data);
	if (!item?.inventoryItemId) {
		return {
			success: false,
			message: "Este producto ya no está vinculado al inventario.",
		};
	}

	const claimed = await markShoppingListItemPurchasedIfPending(item.id);
	if (claimed) {
		const inventoryUpdated = await increaseInventoryItemQuantity(
			item.inventoryItemId,
			item.quantity,
		);
		if (!inventoryUpdated) {
			await setShoppingListItemPurchased(item.id, false);
			return {
				success: false,
				message: "No se ha encontrado el producto en el inventario.",
			};
		}
	}

	revalidatePath(SHOPPING_LIST_PATH);
	revalidatePath(INVENTORY_PATH);
	return { success: true };
}

export async function deleteShoppingListItemAction(
	id: unknown,
): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	const result = shoppingListItemIdSchema.safeParse(id);

	if (!result.success) {
		return invalidInputResult;
	}

	const deleted = await deleteShoppingListItem(result.data);
	if (!deleted) {
		return { success: false, message: "No se ha encontrado el producto." };
	}

	revalidatePath(SHOPPING_LIST_PATH);
	return { success: true };
}

export async function clearPurchasedShoppingListItemsAction(): Promise<ShoppingListActionResult> {
	await requireAuthorizedSession();
	await deletePurchasedShoppingListItems();
	revalidatePath(SHOPPING_LIST_PATH);

	return { success: true };
}
