import "server-only";

import { ObjectId } from "mongodb";
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections";
import { buildWeeklyMealSlotUpdate } from "@/lib/db/weekly-meal-plan-update";
import type {
	WeeklyMealPlan,
	WeeklyMealSlot,
	WeeklyMealSlotInput,
} from "@/schemas/weekly-meal-plan";

interface WeeklyMealSlotDocument extends Omit<WeeklyMealSlot, "dishId"> {
	dishId: ObjectId;
}

interface WeeklyMealPlanDocument extends Omit<WeeklyMealPlan, "id" | "slots"> {
	_id: ObjectId;
	slots: WeeklyMealSlotDocument[];
}

function toWeeklyMealPlan(document: WeeklyMealPlanDocument): WeeklyMealPlan {
	return {
		id: document._id.toHexString(),
		weekStart: document.weekStart,
		slots: document.slots.map((slot) => ({
			date: slot.date,
			mealType: slot.mealType,
			dishId: slot.dishId.toHexString(),
		})),
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};
}

export async function findWeeklyMealPlan(
	weekStart: string,
): Promise<WeeklyMealPlan | null> {
	const collection = await getCollection<WeeklyMealPlanDocument>(
		COLLECTION_NAMES.weeklyMealPlans,
	);
	const document = await collection.findOne({ weekStart });

	return document ? toWeeklyMealPlan(document) : null;
}

export async function isDishUsedInMealPlans(dishId: string): Promise<boolean> {
	const collection = await getCollection<WeeklyMealPlanDocument>(
		COLLECTION_NAMES.weeklyMealPlans,
	);
	const document = await collection.findOne(
		{ "slots.dishId": new ObjectId(dishId) },
		{ projection: { _id: 1 } },
	);

	return document !== null;
}

export async function setWeeklyMealSlot(
	input: WeeklyMealSlotInput,
): Promise<void> {
	const collection = await getCollection<WeeklyMealPlanDocument>(
		COLLECTION_NAMES.weeklyMealPlans,
	);
	const dishId = input.dishId ? new ObjectId(input.dishId) : null;

	await collection.updateOne(
		{ weekStart: input.weekStart },
		buildWeeklyMealSlotUpdate(input, dishId, new Date()),
		{ upsert: dishId !== null },
	);
}
