"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import {
	createShoppingListItem,
	deletePurchasedShoppingListItems,
	deleteShoppingListItem,
	setShoppingListItemPurchased,
	updateShoppingListItem,
} from "@/lib/db/shopping-list-items";
import {
	shoppingListItemIdSchema,
	shoppingListItemInputSchema,
	shoppingListItemPurchasedSchema,
} from "@/schemas/shopping-list-item";

const SHOPPING_LIST_PATH = "/shopping-list";

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

	await createShoppingListItem(result.data);
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

	const updated = await updateShoppingListItem(idResult.data, inputResult.data);
	if (!updated) {
		return { success: false, message: "No se ha encontrado el producto." };
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
