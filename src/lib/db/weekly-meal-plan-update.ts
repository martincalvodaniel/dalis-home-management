import "server-only";

import type { Document, ObjectId } from "mongodb";
import type { WeeklyMealSlotInput } from "@/schemas/weekly-meal-plan";

export function buildWeeklyMealSlotUpdate(
	input: WeeklyMealSlotInput,
	dishId: ObjectId | null,
	now: Date,
): Document[] {
	const remainingSlots = {
		$filter: {
			input: { $ifNull: ["$slots", []] },
			as: "slot",
			cond: {
				$not: [
					{
						$and: [
							{ $eq: ["$$slot.date", input.date] },
							{ $eq: ["$$slot.mealType", input.mealType] },
						],
					},
				],
			},
		},
	};
	const slots = dishId
		? {
				$concatArrays: [
					remainingSlots,
					[{ date: input.date, mealType: input.mealType, dishId }],
				],
			}
		: remainingSlots;

	return [
		{
			$set: {
				weekStart: input.weekStart,
				slots,
				createdAt: { $ifNull: ["$createdAt", now] },
				updatedAt: now,
			},
		},
	];
}
