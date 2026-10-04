"use server";

import { revalidatePath } from "next/cache";
import { requireAuthorizedSession } from "@/lib/auth/session";
import {
	createDish,
	deleteDish,
	findDishById,
	listDishes,
	updateDish,
} from "@/lib/db/dishes";
import { listInventoryItems } from "@/lib/db/inventory-items";
import { addMealPlanSuggestionsToShoppingList } from "@/lib/db/shopping-list-items";
import {
	copyPreviousWeekIntoEmptyPlan,
	deleteWeeklyMealPlan,
	findWeeklyMealPlan,
	isDishUsedInMealPlans,
	setWeeklyMealSlot,
} from "@/lib/db/weekly-meal-plans";
import { dishIdSchema, dishInputSchema } from "@/schemas/dish";
import {
	weeklyMealSlotInputSchema,
	weekStartSchema,
} from "@/schemas/weekly-meal-plan";
import { buildMealPlanShoppingSuggestions } from "./shopping-list-suggestions";

const MEALS_PATH = "/meals";
const MEAL_PLAN_PATH = "/meal-plan";
const SHOPPING_LIST_PATH = "/shopping-list";

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

type GenerateShoppingListResult =
	| { success: true; itemCount: number }
	| { success: false; message: string };

export async function generateWeeklyShoppingListAction(
	weekStart: unknown,
): Promise<GenerateShoppingListResult> {
	await requireAuthorizedSession();
	const result = weekStartSchema.safeParse(weekStart);

	if (!result.success) {
		return { success: false, message: "La semana seleccionada no es válida." };
	}

	const [mealPlan, dishes, inventoryItems] = await Promise.all([
		findWeeklyMealPlan(result.data),
		listDishes(),
		listInventoryItems(),
	]);

	if (!mealPlan || mealPlan.slots.length === 0) {
		return {
			success: false,
			message: "Planifica al menos una comida antes de preparar la lista.",
		};
	}

	const suggestions = buildMealPlanShoppingSuggestions(
		mealPlan,
		dishes,
		inventoryItems,
	);
	await addMealPlanSuggestionsToShoppingList(suggestions);
	revalidatePath(SHOPPING_LIST_PATH);

	return { success: true, itemCount: suggestions.length };
}

export async function copyPreviousWeekAction(
	weekStart: unknown,
): Promise<DishActionResult> {
	await requireAuthorizedSession();
	const result = weekStartSchema.safeParse(weekStart);

	if (!result.success) {
		return { success: false, message: "La semana seleccionada no es válida." };
	}

	const copyResult = await copyPreviousWeekIntoEmptyPlan(result.data);
	if (copyResult === "source-empty") {
		return {
			success: false,
			message: "La semana anterior no tiene comidas que copiar.",
		};
	}
	if (copyResult === "target-not-empty") {
		return {
			success: false,
			message: "Esta semana ya tiene comidas y no se ha sobrescrito.",
		};
	}

	revalidatePath(MEAL_PLAN_PATH);
	return { success: true };
}

export async function clearWeeklyMealPlanAction(
	weekStart: unknown,
): Promise<DishActionResult> {
	await requireAuthorizedSession();
	const result = weekStartSchema.safeParse(weekStart);

	if (!result.success) {
		return { success: false, message: "La semana seleccionada no es válida." };
	}

	const deleted = await deleteWeeklyMealPlan(result.data);
	if (!deleted) {
		return {
			success: false,
			message: "Esta semana ya estaba vacía.",
		};
	}

	revalidatePath(MEAL_PLAN_PATH);
	return { success: true };
}
