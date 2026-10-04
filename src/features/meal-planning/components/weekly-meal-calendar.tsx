import type { DishOption } from "@/features/meal-planning/dish-option";
import type { WeeklyMealSlot } from "@/schemas/weekly-meal-plan";
import { getWeekDates } from "@/schemas/weekly-meal-plan";
import { MealDayCard } from "./meal-day-card";

interface WeeklyMealCalendarProps {
	weekStart: string;
	today: string;
	slots: WeeklyMealSlot[];
	dishes: DishOption[];
}

export function WeeklyMealCalendar({
	weekStart,
	today,
	slots,
	dishes,
}: WeeklyMealCalendarProps) {
	return (
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
			{getWeekDates(weekStart).map((date) => (
				<MealDayCard
					key={date}
					weekStart={weekStart}
					date={date}
					today={today}
					slots={slots}
					dishes={dishes}
				/>
			))}
		</div>
	);
}
