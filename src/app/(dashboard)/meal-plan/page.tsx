import type { Metadata } from "next";
import { MealPlanPage } from "@/features/meal-planning/components/meal-plan-page";
import {
	getCurrentWeekStart,
	getMadridIsoDate,
} from "@/features/meal-planning/week-utils";
import { listDishes } from "@/lib/db/dishes";
import { findWeeklyMealPlan } from "@/lib/db/weekly-meal-plans";
import { weekStartSchema } from "@/schemas/weekly-meal-plan";

export const metadata: Metadata = {
	title: "Menú semanal — Dali",
	description: "Calendario semanal de comidas y cenas de Dani y Pali.",
};

interface MealPlanRouteProps {
	searchParams: Promise<{ week?: string | string[] }>;
}

export default async function MealPlanRoute({
	searchParams,
}: MealPlanRouteProps) {
	const params = await searchParams;
	const requestedWeek = Array.isArray(params.week)
		? params.week[0]
		: params.week;
	const parsedWeek = weekStartSchema.safeParse(requestedWeek);
	const weekStart = parsedWeek.success
		? parsedWeek.data
		: getCurrentWeekStart();
	const [dishes, mealPlan] = await Promise.all([
		listDishes(),
		findWeeklyMealPlan(weekStart),
	]);

	return (
		<MealPlanPage
			weekStart={weekStart}
			today={getMadridIsoDate()}
			slots={mealPlan?.slots ?? []}
			dishes={dishes.map(({ id, name }) => ({ id, name }))}
		/>
	);
}
