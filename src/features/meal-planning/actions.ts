"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import {
	createDish,
	deleteDish,
	findDishById,
	updateDish,
} from "@/lib/db/dishes";
import {
	isDishUsedInMealPlans,
	setWeeklyMealSlot,
} from "@/lib/db/weekly-meal-plans";
import { dishIdSchema, dishInputSchema } from "@/schemas/dish";
import { weeklyMealSlotInputSchema } from "@/schemas/weekly-meal-plan";

const MEALS_PATH = "/meals";
const MEAL_PLAN_PATH = "/meal-plan";

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

	if (await isDishUsedInMealPlans(result.data)) {
		return {
			success: false,
			message: "Quita este plato de los menús semanales antes de eliminarlo.",
		};
	}

	const deleted = await deleteDish(result.data);
	if (!deleted) {
		return { success: false, message: "No se ha encontrado el plato." };
	}

	revalidatePath(MEALS_PATH);
	return { success: true };
}

export async function setWeeklyMealSlotAction(
	input: unknown,
): Promise<DishActionResult> {
	await requireAuthorizedSession();
	const result = weeklyMealSlotInputSchema.safeParse(input);

	if (!result.success) {
		return {
			success: false,
			message: "Revisa la semana, el día y el plato seleccionado.",
		};
	}

	if (result.data.dishId) {
		const dish = await findDishById(result.data.dishId);
		if (!dish) {
			return { success: false, message: "No se ha encontrado el plato." };
		}
	}

	await setWeeklyMealSlot(result.data);
	revalidatePath(MEAL_PLAN_PATH);
	return { success: true };
}
