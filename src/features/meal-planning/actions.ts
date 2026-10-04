"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import { createDish, deleteDish, updateDish } from "@/lib/db/dishes";
import { dishIdSchema, dishInputSchema } from "@/schemas/dish";

const MEALS_PATH = "/meals";

type DishActionResult = { success: true } | { success: false; message: string };

const invalidInputResult: DishActionResult = {
	success: false,
	message: "Revisa el plato y sus ingredientes e inténtalo de nuevo.",
};

export async function createDishAction(
	input: unknown,
): Promise<DishActionResult> {
	await requireAuthorizedSession();
	const result = dishInputSchema.safeParse(input);

	if (!result.success) {
		return invalidInputResult;
	}

	await createDish(result.data);
	revalidatePath(MEALS_PATH);
	return { success: true };
}

export async function updateDishAction(
	id: unknown,
	input: unknown,
): Promise<DishActionResult> {
	await requireAuthorizedSession();
	const idResult = dishIdSchema.safeParse(id);
	const inputResult = dishInputSchema.safeParse(input);

	if (!idResult.success || !inputResult.success) {
		return invalidInputResult;
	}

	const updated = await updateDish(idResult.data, inputResult.data);
	if (!updated) {
		return { success: false, message: "No se ha encontrado el plato." };
	}

	revalidatePath(MEALS_PATH);
	return { success: true };
}

export async function deleteDishAction(id: unknown): Promise<DishActionResult> {
	await requireAuthorizedSession();
	const result = dishIdSchema.safeParse(id);

	if (!result.success) {
		return invalidInputResult;
	}

	const deleted = await deleteDish(result.data);
	if (!deleted) {
		return { success: false, message: "No se ha encontrado el plato." };
	}

	revalidatePath(MEALS_PATH);
	return { success: true };
}
