"use client";

import { useState, useTransition } from "react";
import { clearPurchasedShoppingListItemsAction } from "@/features/shopping-list/actions";

interface ClearPurchasedButtonProps {
	count: number;
}

export function ClearPurchasedButton({ count }: ClearPurchasedButtonProps) {
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function clearPurchasedItems() {
		if (
			!window.confirm(
				`¿Eliminar ${count === 1 ? "el producto comprado" : `los ${count} productos comprados`}?`,
			)
		) {
			return;
		}

		setError(null);
		startTransition(async () => {
			try {
				const result = await clearPurchasedShoppingListItemsAction();
				if (!result.success) {
					setError(result.message);
				}
			} catch {
				setError("No se han podido limpiar los productos comprados.");
			}
		});
	}

	return (
		<div className="text-right">
			<button
				type="button"
				onClick={clearPurchasedItems}
				disabled={isPending}
				className="rounded-full px-3 py-1.5 text-xs font-semibold text-[#8f5140] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 disabled:cursor-wait disabled:opacity-50 dark:text-[#e9a995] dark:hover:bg-red-950/30"
			>
				{isPending ? "Limpiando…" : "Limpiar comprados"}
			</button>
			{error ? (
				<p className="mt-1 text-xs font-medium text-red-700 dark:text-red-300">
					{error}
				</p>
			) : null}
		</div>
	);
}
