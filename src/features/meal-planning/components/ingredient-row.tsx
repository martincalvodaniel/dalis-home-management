"use client";

import { ProductPicker } from "@/features/catalog/components/product-picker";
import type { CatalogProductOption } from "@/features/catalog/product-option";

export interface IngredientDraft {
	key: string;
	quantity: string;
	inventoryItemId: string;
	legacyName?: string;
}

interface IngredientRowProps {
	index: number;
	ingredient: IngredientDraft;
	products: CatalogProductOption[];
	canRemove: boolean;
	disabled: boolean;
	onChange: (ingredient: IngredientDraft) => void;
	onRemove: () => void;
	onRequestProductCreation: () => void;
}

export function IngredientRow({
	index,
	ingredient,
	products,
	canRemove,
	disabled,
	onChange,
	onRemove,
	onRequestProductCreation,
}: IngredientRowProps) {
	return (
		<div className="rounded-2xl border border-[#ded9c7] bg-white/65 p-4 dark:border-white/10 dark:bg-[#182e26]/80">
			<div className="flex items-center justify-between gap-3">
				<p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7e806d] dark:text-[#adb3a4]">
					Ingrediente {index + 1}
				</p>
				{canRemove ? (
					<button
						type="button"
						onClick={onRemove}
						className="rounded-full px-2.5 py-1 text-xs font-semibold text-[#92523e] transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 dark:text-[#e9a995] dark:hover:bg-red-950/30"
					>
						Quitar
					</button>
				) : null}
			</div>

			<div className="mt-3 text-xs font-semibold">
				<label htmlFor={`inventory-${ingredient.key}`}>Producto</label>
				<ProductPicker
					id={`inventory-${ingredient.key}`}
					products={products}
					value={ingredient.inventoryItemId}
					onValueChange={(inventoryItemId) =>
						onChange({ ...ingredient, inventoryItemId, legacyName: undefined })
					}
					disabled={disabled}
					className="mt-1.5 min-h-11 focus:border-[#8a7633] focus:ring-[#8a7633]/20"
				/>
				<button
					type="button"
					onClick={onRequestProductCreation}
					disabled={disabled}
					className="mt-2 rounded-full px-2 py-1 text-xs font-semibold text-[#75611f] underline decoration-[#b4a66e] underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[#8a7633] disabled:opacity-60 dark:text-[#dccb8d]"
				>
					+ Crear producto nuevo
				</button>
			</div>
			{ingredient.legacyName && !ingredient.inventoryItemId ? (
				<p className="mt-2 rounded-xl bg-[#fff3cd] px-3 py-2 text-xs leading-5 text-[#6f5a16] dark:bg-[#594917]/45 dark:text-[#f1dc93]">
					“{ingredient.legacyName}” procede de un plato antiguo. Selecciona o
					crea su producto para volver a guardar el plato.
				</p>
			) : null}

			<div className="mt-3">
				<label
					className="block text-xs font-semibold"
					htmlFor={`ingredient-quantity-${ingredient.key}`}
				>
					Cantidad
					<input
						id={`ingredient-quantity-${ingredient.key}`}
						type="number"
						min="0.01"
						max="999999"
						step="any"
						required
						value={ingredient.quantity}
						onChange={(event) =>
							onChange({ ...ingredient, quantity: event.target.value })
						}
						className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d0d4c8] bg-white px-3 font-normal outline-none transition focus:border-[#8a7633] focus:ring-2 focus:ring-[#8a7633]/15 dark:border-white/15 dark:bg-[#10231c]"
					/>
				</label>
			</div>
		</div>
	);
}
