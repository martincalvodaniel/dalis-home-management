"use client";

import { useState, useTransition } from "react";
import {
	deleteInventoryItemAction,
	markInventoryItemOutOfStockAction,
} from "@/features/inventory/actions";
import {
	inventoryLocationLabels,
	inventoryUnitShortLabels,
} from "@/features/inventory/inventory-options";
import { addInventoryItemToShoppingListAction } from "@/features/shopping-list/actions";
import type { InventoryItem } from "@/schemas/inventory-item";

interface InventoryItemCardProps {
	item: InventoryItem;
	onEdit: (item: InventoryItem) => void;
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
	maximumFractionDigits: 2,
});

export function InventoryItemCard({ item, onEdit }: InventoryItemCardProps) {
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();
	const isOutOfStock = item.quantity === 0;

	function markOutOfStock() {
		setError(null);
		setNotice(null);
		startTransition(async () => {
			try {
				const result = await markInventoryItemOutOfStockAction(item.id);
				if (!result.success) {
					setError(result.message);
				}
			} catch {
				setError("No se ha podido actualizar el producto.");
			}
		});
	}

	function removeItem() {
		if (!window.confirm(`¿Eliminar ${item.name} del inventario?`)) {
			return;
		}

		setError(null);
		setNotice(null);
		startTransition(async () => {
			try {
				const result = await deleteInventoryItemAction(item.id);
				if (!result.success) {
					setError(result.message);
				}
			} catch {
				setError("No se ha podido eliminar el producto.");
			}
		});
	}

	function addToShoppingList() {
		setError(null);
		setNotice(null);
		startTransition(async () => {
			try {
				const result = await addInventoryItemToShoppingListAction(item.id);
				if (!result.success) {
					setError(result.message);
					return;
				}

				setNotice("Añadido a la lista. Pulsa de nuevo para sumar otra unidad.");
			} catch {
				setError("No se ha podido añadir el producto a la compra.");
			}
		});
	}

	return (
		<article
			className={`rounded-2xl border p-5 transition ${
				isOutOfStock
					? "border-[#ead6ca] bg-[#fbede5]/70 dark:border-[#704735] dark:bg-[#412d24]/80"
					: "border-[#dde1d8] bg-white/75 shadow-[0_10px_30px_rgba(50,72,60,0.05)] dark:border-white/10 dark:bg-[#182e26]/80"
			}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-lg font-semibold tracking-[-0.03em]">
						{item.name}
					</p>
					<p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a8a81] dark:text-[#a6b3ab]">
						{inventoryLocationLabels[item.location]}
					</p>
				</div>
				<span
					className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
						isOutOfStock
							? "bg-[#f3cdb9] text-[#7d3e25] dark:bg-[#754530] dark:text-[#ffe2d2]"
							: "bg-[#dce9dc] text-[#365b43] dark:bg-[#294b3e] dark:text-[#cfe2d5]"
					}`}
				>
					{isOutOfStock
						? "Agotado"
						: `${quantityFormatter.format(item.quantity)} ${inventoryUnitShortLabels[item.unit]}`}
				</span>
			</div>

			{error ? (
				<p className="mt-3 text-xs font-medium text-red-700 dark:text-red-300">
					{error}
				</p>
			) : null}
			{notice ? (
				<p
					className="mt-3 text-xs font-medium text-[#3e674b] dark:text-[#b9d4c0]"
					aria-live="polite"
				>
					{notice}
				</p>
			) : null}

			<div className="mt-5 flex flex-wrap gap-2 border-t border-[#e3e6df] pt-4 dark:border-white/10">
				{isOutOfStock ? (
					<button
						type="button"
						onClick={addToShoppingList}
						disabled={isPending}
						className="rounded-full bg-[#1d4f40] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:cursor-wait disabled:opacity-50"
					>
						{isPending ? "Añadiendo…" : "Añadir a compra"}
					</button>
				) : null}
				<button
					type="button"
					onClick={() => onEdit(item)}
					disabled={isPending}
					className="rounded-full bg-[#edf0e9] px-3.5 py-2 text-xs font-semibold transition hover:bg-[#e1e7de] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:opacity-50 dark:bg-white/10 dark:hover:bg-white/15"
				>
					Editar
				</button>
				{isOutOfStock ? null : (
					<button
						type="button"
						onClick={markOutOfStock}
						disabled={isPending}
						className="rounded-full border border-[#d8c5b8] px-3.5 py-2 text-xs font-semibold text-[#8b5138] transition hover:bg-[#fae8dd] focus:outline-none focus:ring-2 focus:ring-[#b76543] disabled:opacity-50 dark:border-[#704b39] dark:text-[#efb89e] dark:hover:bg-[#4a3025]"
					>
						Marcar agotado
					</button>
				)}
				<button
					type="button"
					onClick={removeItem}
					disabled={isPending}
					className="ml-auto rounded-full px-3 py-2 text-xs font-semibold text-[#8f5140] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:opacity-50 dark:text-[#e9a995] dark:hover:bg-red-950/30"
				>
					Eliminar
				</button>
			</div>
		</article>
	);
}
