"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { generateWeeklyShoppingListAction } from "@/features/meal-planning/actions";

interface GenerateShoppingListButtonProps {
	weekStart: string;
}

export function GenerateShoppingListButton({
	weekStart,
}: GenerateShoppingListButtonProps) {
	const [message, setMessage] = useState<string | null>(null);
	const [isError, setIsError] = useState(false);
	const [isPending, startTransition] = useTransition();

	function generateShoppingList() {
		setMessage(null);
		setIsError(false);

		startTransition(async () => {
			try {
				const result = await generateWeeklyShoppingListAction(weekStart);
				if (!result.success) {
					setIsError(true);
					setMessage(result.message);
					return;
				}

				setMessage(
					result.itemCount === 0
						? "El inventario ya cubre todo lo planificado."
						: `${result.itemCount} ${result.itemCount === 1 ? "ingrediente preparado" : "ingredientes preparados"} en la lista.`,
				);
			} catch {
				setIsError(true);
				setMessage("No se ha podido preparar la lista. Inténtalo de nuevo.");
			}
		});
	}

	return (
		<div className="rounded-2xl border border-[#e2cfbd] bg-[#f8e8dc] p-4 text-[#573727] sm:flex sm:items-center sm:justify-between sm:gap-5 dark:border-[#704735] dark:bg-[#412d24] dark:text-[#fff4ed]">
			<div>
				<p className="text-sm font-semibold">Compra de esta semana</p>
				<p className="mt-1 text-xs leading-5 text-[#7d5947] dark:text-[#e4c3b3]">
					Suma los ingredientes y descuenta lo que ya hay en el inventario.
				</p>
				{message ? (
					<p
						className={`mt-2 text-xs font-semibold ${isError ? "text-[#a34435] dark:text-[#ffb4a4]" : "text-[#477052] dark:text-[#a9d6b4]"}`}
						role={isError ? "alert" : "status"}
					>
						{message}{" "}
						{!isError ? (
							<Link
								href="/shopping-list"
								className="underline underline-offset-2"
							>
								Abrir lista
							</Link>
						) : null}
					</p>
				) : null}
			</div>
			<button
				type="button"
				onClick={generateShoppingList}
				disabled={isPending}
				className="mt-4 inline-flex min-h-11 w-full shrink-0 items-center justify-center rounded-xl bg-[#a75938] px-4 text-sm font-semibold text-white transition hover:bg-[#8f482d] focus:outline-none focus:ring-2 focus:ring-[#a75938] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-65 sm:mt-0 sm:w-auto dark:ring-offset-[#412d24]"
			>
				{isPending ? "Calculando…" : "Añadir lo que falta"}
			</button>
		</div>
	);
}
