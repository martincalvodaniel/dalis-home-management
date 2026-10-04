"use client";

import { quantityUnitLabels } from "@/config/quantity-units";
import { type QuantityUnit, quantityUnits } from "@/schemas/quantity-unit";
import type { InventoryIngredientOption } from "../ingredient-option";

export interface IngredientDraft {
	key: string;
	name: string;
	quantity: string;
	unit: QuantityUnit;
	inventoryItemId: string;
}

interface IngredientRowProps {
	index: number;
	ingredient: IngredientDraft;
	inventoryOptions: InventoryIngredientOption[];
	canRemove: boolean;
	onChange: (ingredient: IngredientDraft) => void;
	onRemove: () => void;
}

export function IngredientRow({
	index,
	ingredient,
	inventoryOptions,
	canRemove,
	onChange,
	onRemove,
}: IngredientRowProps) {
	function selectInventoryItem(inventoryItemId: string) {
		const inventoryItem = inventoryOptions.find(
			(option) => option.id === inventoryItemId,
		);

		onChange({
			...ingredient,
			inventoryItemId,
			name: inventoryItem?.name ?? ingredient.name,
			unit: inventoryItem?.unit ?? ingredient.unit,
		});
	}

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

			<label
				className="mt-3 block text-xs font-semibold"
				htmlFor={`inventory-${ingredient.key}`}
			>
				Vincular al inventario
				<select
					id={`inventory-${ingredient.key}`}
					value={ingredient.inventoryItemId}
					onChange={(event) => selectInventoryItem(event.target.value)}
					className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d0d4c8] bg-white px-3 font-normal outline-none transition focus:border-[#8a7633] focus:ring-2 focus:ring-[#8a7633]/15 dark:border-white/15 dark:bg-[#10231c]"
				>
					<option value="">Sin vincular</option>
					{inventoryOptions.map((option) => (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					))}
				</select>
			</label>
			{ingredient.inventoryItemId ? (
				<p className="mt-2 text-xs leading-5 text-[#66766c] dark:text-[#acb8b0]">
					El nombre y la unidad se mantienen sincronizados con el inventario.
					Selecciona “Sin vincular” para personalizarlos.
				</p>
			) : null}

			<label
				className="mt-3 block text-xs font-semibold"
				htmlFor={`ingredient-name-${ingredient.key}`}
			>
				Nombre
				<input
					id={`ingredient-name-${ingredient.key}`}
					type="text"
					required
					maxLength={120}
					readOnly={ingredient.inventoryItemId.length > 0}
					value={ingredient.name}
					onChange={(event) =>
						onChange({ ...ingredient, name: event.target.value })
					}
					placeholder="Por ejemplo, tomate"
					className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d0d4c8] bg-white px-3 font-normal outline-none transition placeholder:text-[#9aa59e] focus:border-[#8a7633] focus:ring-2 focus:ring-[#8a7633]/15 dark:border-white/15 dark:bg-[#10231c]"
				/>
			</label>

			<div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-3">
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
				<label
					className="block text-xs font-semibold"
					htmlFor={`ingredient-unit-${ingredient.key}`}
				>
					Unidad
					<select
						id={`ingredient-unit-${ingredient.key}`}
						value={ingredient.unit}
						disabled={ingredient.inventoryItemId.length > 0}
						onChange={(event) =>
							onChange({
								...ingredient,
								unit: event.target.value as QuantityUnit,
							})
						}
						className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d0d4c8] bg-white px-3 font-normal outline-none transition focus:border-[#8a7633] focus:ring-2 focus:ring-[#8a7633]/15 dark:border-white/15 dark:bg-[#10231c]"
					>
						{quantityUnits.map((unit) => (
							<option key={unit} value={unit}>
								{quantityUnitLabels[unit]}
							</option>
						))}
					</select>
				</label>
			</div>
		</div>
	);
}
