import Link from "next/link";
import type { DishOption } from "@/features/meal-planning/dish-option";
import {
	addDaysToIsoDate,
	type WeeklyMealSlot,
} from "@/schemas/weekly-meal-plan";
import { CopyPreviousWeekButton } from "./copy-previous-week-button";
import { GenerateShoppingListButton } from "./generate-shopping-list-button";
import { WeeklyMealCalendar } from "./weekly-meal-calendar";

interface MealPlanPageProps {
	weekStart: string;
	today: string;
	slots: WeeklyMealSlot[];
	dishes: DishOption[];
}

const weekDateFormatter = new Intl.DateTimeFormat("es-ES", {
	day: "numeric",
	month: "long",
	timeZone: "UTC",
});

function formatWeekRange(weekStart: string): string {
	const start = new Date(`${weekStart}T00:00:00.000Z`);
	const end = new Date(`${addDaysToIsoDate(weekStart, 6)}T00:00:00.000Z`);

	return `${weekDateFormatter.format(start)} — ${weekDateFormatter.format(end)}`;
}

export function MealPlanPage({
	weekStart,
	today,
	slots,
	dishes,
}: MealPlanPageProps) {
	const previousWeek = addDaysToIsoDate(weekStart, -7);
	const nextWeek = addDaysToIsoDate(weekStart, 7);

	return (
		<main className="min-h-screen bg-[#f5f4ee] px-4 py-5 text-[#17352b] sm:px-8 sm:py-8 dark:bg-[#10221c] dark:text-[#f4f1e7]">
			<div className="mx-auto w-full max-w-[96rem]">
				<header className="border-b border-[#d9ded3] pb-6 dark:border-white/10">
					<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<Link
								href="/dashboard"
								className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#5f7167] transition hover:text-[#17352b] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:text-[#aebcb3] dark:hover:text-white"
							>
								<span aria-hidden="true">←</span>
								Dali
							</Link>
							<p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#c36d49]">
								Planificación de casa
							</p>
							<h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
								Menú semanal
							</h1>
							<p className="mt-3 text-sm text-[#63736a] sm:text-base dark:text-[#b4c0b8]">
								{formatWeekRange(weekStart)} · {slots.length} de 14 comidas
								planificadas
							</p>
						</div>

						<div className="flex flex-wrap gap-2">
							<Link
								href="/meals"
								className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#ccd5ce] bg-white/70 px-4 text-sm font-semibold transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
							>
								Gestionar platos
							</Link>
							<nav
								aria-label="Cambiar semana"
								className="flex overflow-hidden rounded-xl border border-[#ccd5ce] bg-white/70 dark:border-white/15 dark:bg-white/5"
							>
								<Link
									href={`/meal-plan?week=${previousWeek}`}
									aria-label="Semana anterior"
									className="grid min-h-11 min-w-11 place-items-center transition hover:bg-[#e8ece6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1d4f40] dark:hover:bg-white/10"
								>
									<span aria-hidden="true">←</span>
								</Link>
								<Link
									href="/meal-plan"
									className="inline-flex min-h-11 items-center border-x border-[#ccd5ce] px-4 text-sm font-semibold transition hover:bg-[#e8ece6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1d4f40] dark:border-white/15 dark:hover:bg-white/10"
								>
									Esta semana
								</Link>
								<Link
									href={`/meal-plan?week=${nextWeek}`}
									aria-label="Semana siguiente"
									className="grid min-h-11 min-w-11 place-items-center transition hover:bg-[#e8ece6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1d4f40] dark:hover:bg-white/10"
								>
									<span aria-hidden="true">→</span>
								</Link>
							</nav>
						</div>
					</div>
				</header>

				<section
					className="space-y-4 py-6"
					aria-label="Comidas y cenas de la semana"
				>
					{slots.length === 0 && dishes.length > 0 ? (
						<CopyPreviousWeekButton weekStart={weekStart} />
					) : null}
					<GenerateShoppingListButton weekStart={weekStart} />
					{dishes.length > 0 ? (
						<WeeklyMealCalendar
							weekStart={weekStart}
							today={today}
							slots={slots}
							dishes={dishes}
						/>
					) : (
						<div className="rounded-2xl border border-dashed border-[#bdc8bf] bg-white/55 px-6 py-12 text-center dark:border-white/15 dark:bg-white/5">
							<h2 className="text-xl font-semibold">Prepara tu primer plato</h2>
							<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#63736a] dark:text-[#b4c0b8]">
								Añade platos con sus ingredientes para poder asignarlos a las
								comidas y cenas de la semana.
							</p>
							<Link
								href="/meals"
								className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-[#1d4f40] px-5 text-sm font-semibold text-white transition hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2"
							>
								Añadir un plato
							</Link>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
