import { quantityUnitShortLabels } from "@/config/quantity-units";
import type { ShoppingListSuggestion } from "@/features/meal-planning/shopping-list-suggestions";

interface ShoppingListPreviewProps {
	suggestions: ShoppingListSuggestion[];
}

const quantityFormatter = new Intl.NumberFormat("es-ES", {
	maximumFractionDigits: 2,
});

export function ShoppingListPreview({ suggestions }: ShoppingListPreviewProps) {
	if (suggestions.length === 0) {
		return (
			<div className="rounded-2xl border border-[#c9dbc9] bg-[#e9f1e6] p-4 text-[#31523f] dark:border-[#42624a] dark:bg-[#263d2d] dark:text-[#d9eadb]">
				<p className="text-sm font-semibold">El inventario cubre el menú</p>
				<p className="mt-1 text-xs leading-5 text-[#597161] dark:text-[#b9cebc]">
					No hace falta añadir ningún ingrediente para esta semana.
				</p>
			</div>
		);
	}

	return (
		<details className="group rounded-2xl border border-[#d8d7bd] bg-[#eeeddc] p-4 text-[#303b2d] dark:border-[#59624e] dark:bg-[#2e382b] dark:text-[#f4f3e7]">
			<summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#74794f]">
				<div>
					<p className="text-sm font-semibold">Vista previa de la compra</p>
					<p className="mt-1 text-xs text-[#69705b] dark:text-[#c0c7b5]">
						{suggestions.length}{" "}
						{suggestions.length === 1
							? "ingrediente pendiente"
							: "ingredientes pendientes"}
					</p>
				</div>
				<span
					className="grid size-8 shrink-0 place-items-center rounded-full bg-white/60 text-lg transition group-open:rotate-45 dark:bg-white/10"
					aria-hidden="true"
				>
					+
				</span>
			</summary>
			<ul className="mt-4 grid gap-2 border-t border-[#d4d3b9] pt-4 text-sm dark:border-white/10 sm:grid-cols-2">
				{suggestions.map((suggestion) => (
					<li
						key={suggestion.inventoryItemId}
						className="flex items-baseline justify-between gap-3 rounded-xl bg-white/45 px-3 py-2.5 dark:bg-white/5"
					>
						<span className="min-w-0 truncate font-medium">
							{suggestion.name}
						</span>
						<span className="shrink-0 text-xs font-semibold text-[#69705b] dark:text-[#c0c7b5]">
							{quantityFormatter.format(suggestion.quantity)}{" "}
							{quantityUnitShortLabels[suggestion.unit]}
						</span>
					</li>
				))}
			</ul>
		</details>
	);
}
