"use client";

import { useState, useTransition } from "react";
import { setWeeklyMealSlotAction } from "@/features/meal-planning/actions";
import type { DishOption } from "@/features/meal-planning/dish-option";
import type { MealType } from "@/schemas/weekly-meal-plan";

interface MealSlotSelectProps {
	weekStart: string;
	date: string;
	mealType: MealType;
	dishId: string | null;
	dishes: DishOption[];
}

const mealLabels: Record<MealType, string> = {
	lunch: "Comida",
	dinner: "Cena",
};

export function MealSlotSelect({
	weekStart,
	date,
	mealType,
	dishId,
	dishes,
}: MealSlotSelectProps) {
	const [selectedDishId, setSelectedDishId] = useState(dishId ?? "");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const label = mealLabels[mealType];

	function handleChange(nextDishId: string) {
		const previousDishId = selectedDishId;
		setSelectedDishId(nextDishId);
		setError(null);

		startTransition(async () => {
			const result = await setWeeklyMealSlotAction({
				weekStart,
				date,
				mealType,
				dishId: nextDishId || null,
			});

			if (!result.success) {
				setSelectedDishId(previousDishId);
				setError(result.message);
			}
		});
	}

	return (
		<div>
			<label
				htmlFor={`${date}-${mealType}`}
				className="mb-1.5 flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#68776e] dark:text-[#afbbb3]"
			>
				<span>{label}</span>
				{isPending ? (
					<span className="normal-case tracking-normal text-[#c36d49]">
						Guardando…
					</span>
				) : null}
			</label>
			<select
				id={`${date}-${mealType}`}
				value={selectedDishId}
				onChange={(event) => handleChange(event.target.value)}
				disabled={isPending}
				className="min-h-11 w-full rounded-xl border border-[#d8ded5] bg-white px-3 text-sm font-medium text-[#28483d] outline-none transition focus:border-[#1d4f40] focus:ring-2 focus:ring-[#1d4f40]/20 disabled:cursor-wait disabled:opacity-70 dark:border-white/10 dark:bg-[#20372f] dark:text-[#f4f1e7]"
			>
				<option value="">Sin planificar</option>
				{dishes.map((dish) => (
					<option key={dish.id} value={dish.id}>
						{dish.name}
					</option>
				))}
			</select>
			{error ? (
				<p className="mt-1.5 text-xs font-medium text-[#a34435]" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}
