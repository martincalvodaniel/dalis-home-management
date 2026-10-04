import type { DishOption } from "@/features/meal-planning/dish-option";
import type { Dish } from "@/schemas/dish";
import type { WeeklyMealSlot } from "@/schemas/weekly-meal-plan";
import { getWeekDates } from "@/schemas/weekly-meal-plan";
import { MealDayCard } from "./meal-day-card";

interface WeeklyMealCalendarProps {
	weekStart: string;
	today: string;
	slots: WeeklyMealSlot[];
	dishes: Dish[];
	dishOptions: DishOption[];
}

export function WeeklyMealCalendar({
	weekStart,
	today,
	slots,
	dishes,
	dishOptions,
}: WeeklyMealCalendarProps) {
	const dishesById = new Map(dishes.map((dish) => [dish.id, dish]));
	const dishIdsBySlot = new Map(
		slots.map((slot) => [`${slot.date}:${slot.mealType}`, slot.dishId]),
	);

	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
			{getWeekDates(weekStart).map((date) => {
				const lunchDishId = dishIdsBySlot.get(`${date}:lunch`);
				const dinnerDishId = dishIdsBySlot.get(`${date}:dinner`);

				return (
					<MealDayCard
						key={date}
						weekStart={weekStart}
						date={date}
						today={today}
						lunchDish={
							lunchDishId ? (dishesById.get(lunchDishId) ?? null) : null
						}
						dinnerDish={
							dinnerDishId ? (dishesById.get(dinnerDishId) ?? null) : null
						}
						dishOptions={dishOptions}
					/>
				);
			})}
		</div>
	);
}
