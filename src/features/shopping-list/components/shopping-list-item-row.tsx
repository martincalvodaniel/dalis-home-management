"use client";

import { useState, useTransition } from "react";
import { quantityUnitShortLabels } from "@/config/quantity-units";
import {
	deleteShoppingListItemAction,
	setShoppingListItemPurchasedAction,
} from "@/features/shopping-list/actions";
import type { ShoppingListItem } from "@/schemas/shopping-list-item";

interface ShoppingListItemRowProps {
	item: ShoppingListItem;
	onEdit: (item: ShoppingListItem) => void;
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
	maximumFractionDigits: 2,
});

export function ShoppingListItemRow({
	item,
	onEdit,
}: ShoppingListItemRowProps) {
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function togglePurchased() {
		setError(null);
		startTransition(async () => {
			try {
				const result = await setShoppingListItemPurchasedAction(
					item.id,
					!item.isPurchased,
				);
				if (!result.success) {
					setError(result.message);
				}
			} catch {
				setError("No se ha podido actualizar el producto.");
			}
		});
	}

	function removeItem() {
		if (!window.confirm(`¿Eliminar ${item.name} de la lista?`)) {
			return;
		}

		setError(null);
		startTransition(async () => {
			try {
				const result = await deleteShoppingListItemAction(item.id);
				if (!result.success) {
					setError(result.message);
				}
			} catch {
				setError("No se ha podido eliminar el producto.");
			}
		});
	}

	return (
		<article className="rounded-2xl border border-[#dde1d8] bg-white/75 p-4 shadow-[0_8px_25px_rgba(50,72,60,0.04)] dark:border-white/10 dark:bg-[#182e26]/80">
			<div className="flex items-start gap-3">
				<button
					type="button"
					onClick={togglePurchased}
					disabled={isPending}
					aria-label={
						item.isPurchased
							? `Marcar ${item.name} como pendiente`
							: `Marcar ${item.name} como comprado`
					}
					className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 disabled:opacity-50 ${
						item.isPurchased
							? "border-[#76977d] bg-[#76977d] text-white"
							: "border-[#aebcaf] hover:border-[#76977d] hover:bg-[#e7efe5] dark:border-[#789086]"
					}`}
				>
					{item.isPurchased ? "✓" : null}
				</button>

				<div className="min-w-0 flex-1">
					<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
						<div className="flex min-w-0 flex-wrap items-center gap-2">
							<p
								className={`font-semibold ${item.isPurchased ? "text-[#7f8d85] line-through" : ""}`}
							>
								{item.name}
							</p>
							{item.inventoryItemId ? (
								<span className="rounded-full bg-[#e5ede3] px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#4e6c57] dark:bg-[#29473b] dark:text-[#c3d8c9]">
									Del inventario
								</span>
							) : null}
						</div>
						<p className="shrink-0 text-sm font-semibold text-[#6b7a72] dark:text-[#abb8b0]">
							{quantityFormatter.format(item.quantity)}{" "}
							{quantityUnitShortLabels[item.unit]}
						</p>
					</div>
					{error ? (
						<p className="mt-2 text-xs font-medium text-red-700 dark:text-red-300">
							{error}
						</p>
					) : null}
					<div className="mt-3 flex gap-2">
						<button
							type="button"
							onClick={() => onEdit(item)}
							disabled={isPending}
							className="rounded-full bg-[#edf0e9] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#e1e7de] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:opacity-50 dark:bg-white/10"
						>
							Editar
						</button>
						<button
							type="button"
							onClick={removeItem}
							disabled={isPending}
							className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#8f5140] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 dark:text-[#e9a995] dark:hover:bg-red-950/30"
						>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		</article>
	);
}
