import { quantityUnitShortLabels } from "@/config/quantity-units";
import type { DishOption } from "@/features/meal-planning/dish-option";
import type { Dish } from "@/schemas/dish";
import type { MealType } from "@/schemas/weekly-meal-plan";
import { MealSlotSelect } from "./meal-slot-select";

interface PlannedMealSlotProps {
	weekStart: string;
	date: string;
	mealType: MealType;
	dish: Dish | null;
	dishOptions: DishOption[];
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
	maximumFractionDigits: 2,
});

export function PlannedMealSlot({
	weekStart,
	date,
	mealType,
	dish,
	dishOptions,
}: PlannedMealSlotProps) {
	return (
		<div>
			<MealSlotSelect
				key={`${mealType}-${dish?.id ?? "empty"}`}
				weekStart={weekStart}
				date={date}
				mealType={mealType}
				dishId={dish?.id ?? null}
				dishes={dishOptions}
			/>
			{dish ? (
				<details className="group mt-2 rounded-lg bg-[#f2f4ef] px-2.5 py-2 dark:bg-white/5">
					<summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[0.7rem] font-semibold text-[#68776e] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:text-[#afbbb3]">
						<span>
							{dish.ingredients.length}{" "}
							{dish.ingredients.length === 1 ? "ingrediente" : "ingredientes"}
						</span>
						<span
							className="text-sm transition group-open:rotate-45"
							aria-hidden="true"
						>
							+
						</span>
					</summary>
					<ul className="mt-2 space-y-1.5 border-t border-[#dce2da] pt-2 text-xs text-[#607067] dark:border-white/10 dark:text-[#bdc8c0]">
						{dish.ingredients.map((ingredient) => (
							<li
								key={ingredient.id}
								className="flex items-baseline justify-between gap-2"
							>
								<span className="min-w-0 truncate">{ingredient.name}</span>
								<span className="shrink-0 font-semibold">
									{quantityFormatter.format(ingredient.quantity)}{" "}
									{quantityUnitShortLabels[ingredient.unit]}
								</span>
							</li>
						))}
					</ul>
				</details>
			) : null}
		</div>
	);
}
