import type { DishOption } from "@/features/meal-planning/dish-option";
import type { Dish } from "@/schemas/dish";
import { PlannedMealSlot } from "./planned-meal-slot";

interface MealDayCardProps {
	weekStart: string;
	date: string;
	today: string;
	lunchDish: Dish | null;
	dinnerDish: Dish | null;
	dishOptions: DishOption[];
}

const dayFormatter = new Intl.DateTimeFormat("es-ES", {
	weekday: "long",
	timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "short",
	timeZone: "UTC",
});

export function MealDayCard({
	weekStart,
	date,
	today,
	lunchDish,
	dinnerDish,
	dishOptions,
}: MealDayCardProps) {
	const parsedDate = new Date(`${date}T00:00:00.000Z`);
	const isToday = date === today;

	return (
		<article
			className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
				isToday
					? "border-[#c36d49] bg-[#fff8f2] ring-1 ring-[#c36d49]/20 dark:bg-[#342820]"
					: "border-[#dce1d9] bg-white/80 dark:border-white/10 dark:bg-white/5"
			}`}
		>
			<header className="mb-5 flex items-start justify-between gap-3">
				<div>
					<h2 className="capitalize text-lg font-semibold tracking-[-0.03em]">
						{dayFormatter.format(parsedDate)}
					</h2>
					<p className="mt-0.5 text-sm text-[#758078] dark:text-[#aeb9b2]">
						{dateFormatter.format(parsedDate)}
					</p>
				</div>
				{isToday ? (
					<span className="rounded-full bg-[#f1d9ca] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-[#914b2e] dark:bg-[#65402f] dark:text-[#ffd9c5]">
						Hoy
					</span>
				) : null}
			</header>

			<div className="space-y-4">
				<PlannedMealSlot
					weekStart={weekStart}
					date={date}
					mealType="lunch"
					dish={lunchDish}
					dishOptions={dishOptions}
				/>
				<PlannedMealSlot
					weekStart={weekStart}
					date={date}
					mealType="dinner"
					dish={dinnerDish}
					dishOptions={dishOptions}
				/>
			</div>
		</article>
	);
}
