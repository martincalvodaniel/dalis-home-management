"use client";

import { useState, useTransition } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { clearPurchasedShoppingListItemsAction } from "@/features/shopping-list/actions";

interface ClearPurchasedButtonProps {
	count: number;
}

export function ClearPurchasedButton({ count }: ClearPurchasedButtonProps) {
	const [error, setError] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	function clearPurchasedItems() {
		setIsDialogOpen(false);
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
				onClick={() => setIsDialogOpen(true)}
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
			<ConfirmationDialog
				open={isDialogOpen}
				title="Limpiar productos comprados"
				description={`Se eliminarán ${count === 1 ? "el producto comprado" : `los ${count} productos comprados`} de la lista.`}
				confirmLabel="Limpiar"
				tone="danger"
				onConfirm={clearPurchasedItems}
				onDismiss={() => setIsDialogOpen(false)}
			/>
		</div>
	);
}
