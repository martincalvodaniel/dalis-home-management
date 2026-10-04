"use client";

import { type FormEvent, useState, useTransition } from "react";
import { ErrorBanner } from "@/components/ui/error-banner";
import { quantityUnitLabels } from "@/config/quantity-units";
import {
	createShoppingListItemAction,
	updateShoppingListItemAction,
} from "@/features/shopping-list/actions";
import { quantityUnits } from "@/schemas/quantity-unit";
import type { ShoppingListItem } from "@/schemas/shopping-list-item";

interface ShoppingListFormProps {
	item: ShoppingListItem | null;
	onCancel: () => void;
	onSaved: () => void;
}

export function ShoppingListForm({
	item,
	onCancel,
	onSaved,
}: ShoppingListFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const isEditing = item !== null;

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError(null);
		const form = event.currentTarget;
		const formData = new FormData(form);
		const input = {
			name: formData.get("name"),
			quantity: Number(formData.get("quantity")),
			unit: formData.get("unit"),
		};

		startTransition(async () => {
			try {
				const result = item
					? await updateShoppingListItemAction(item.id, input)
					: await createShoppingListItemAction(input);

				if (!result.success) {
					setError(result.message);
					return;
				}

				form.reset();
				onSaved();
			} catch {
				setError("No se ha podido guardar el producto. Inténtalo de nuevo.");
			}
		});
	}

	return (
		<section className="rounded-[1.75rem] border border-[#e6d8cb] bg-[#f8e7dd]/75 p-5 shadow-[0_18px_50px_rgba(91,57,40,0.08)] sm:p-6 dark:border-[#704735] dark:bg-[#412d24]/80">
			<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a75938] dark:text-[#efb89e]">
				{isEditing ? "Editar producto" : "Apuntar producto"}
			</p>
			<h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
				{isEditing ? item.name : "¿Qué hace falta?"}
			</h2>

			<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
				<label className="block text-sm font-semibold" htmlFor="name">
					Nombre
					<input
						id="name"
						name="name"
						type="text"
						required
						maxLength={120}
						defaultValue={item?.name}
						placeholder="Por ejemplo, tomates"
						className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c5b8] bg-white/85 px-4 font-normal outline-none transition placeholder:text-[#9c887d] focus:border-[#a75938] focus:ring-2 focus:ring-[#a75938]/15 dark:border-white/15 dark:bg-[#2e211c]"
					/>
				</label>

				<div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-3">
					<label className="block text-sm font-semibold" htmlFor="quantity">
						Cantidad
						<input
							id="quantity"
							name="quantity"
							type="number"
							min="0.01"
							max="999999"
							step="any"
							required
							defaultValue={item?.quantity ?? 1}
							className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c5b8] bg-white/85 px-4 font-normal outline-none transition focus:border-[#a75938] focus:ring-2 focus:ring-[#a75938]/15 dark:border-white/15 dark:bg-[#2e211c]"
						/>
					</label>
					<label className="block text-sm font-semibold" htmlFor="unit">
						Unidad
						<select
							id="unit"
							name="unit"
							defaultValue={item?.unit ?? "unit"}
							className="mt-2 min-h-12 w-full rounded-xl border border-[#d8c5b8] bg-white/85 px-3 font-normal outline-none transition focus:border-[#a75938] focus:ring-2 focus:ring-[#a75938]/15 dark:border-white/15 dark:bg-[#2e211c]"
						>
							{quantityUnits.map((unit) => (
								<option key={unit} value={unit}>
									{quantityUnitLabels[unit]}
								</option>
							))}
						</select>
					</label>
				</div>

				{error ? <ErrorBanner>{error}</ErrorBanner> : null}

				<div className="flex flex-col gap-2 pt-1 sm:flex-row">
					<button
						type="submit"
						disabled={isPending}
						className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#a75938] px-5 text-sm font-semibold text-white transition hover:bg-[#8e472c] focus:outline-none focus:ring-2 focus:ring-[#a75938] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:ring-offset-[#412d24]"
					>
						{isPending ? "Guardando…" : isEditing ? "Guardar" : "Añadir"}
					</button>
					{isEditing ? (
						<button
							type="button"
							onClick={onCancel}
							disabled={isPending}
							className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d8c5b8] px-5 text-sm font-semibold transition hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#a75938] disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
						>
							Cancelar
						</button>
					) : null}
				</div>
			</form>
		</section>
	);
}
