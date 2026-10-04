"use client";

import type { InventoryItem } from "@/schemas/inventory-item";
import { InventoryItemCard } from "./inventory-item-card";

interface InventoryListProps {
	items: InventoryItem[];
	onEdit: (item: InventoryItem) => void;
}

export function InventoryList({ items, onEdit }: InventoryListProps) {
	if (items.length === 0) {
		return (
			<section className="grid min-h-72 place-items-center rounded-[1.75rem] border border-dashed border-[#cbd4ca] bg-white/35 p-8 text-center dark:border-white/15 dark:bg-white/[0.025]">
				<div className="max-w-sm">
					<div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#dfe9dc] text-2xl dark:bg-[#254338]">
						<span aria-hidden="true">⌂</span>
					</div>
					<h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
						La casa está por estrenar
					</h2>
					<p className="mt-2 text-sm leading-6 text-[#697970] dark:text-[#aebbb3]">
						Añade el primer producto para empezar a organizar lo que tenéis en
						casa.
					</p>
				</div>
			</section>
		);
	}

	return (
		<section aria-labelledby="inventory-list-title">
			<div className="flex items-center justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a8a81] dark:text-[#9baaa1]">
						En casa
					</p>
					<h2
						id="inventory-list-title"
						className="mt-1 text-2xl font-semibold tracking-[-0.04em]"
					>
						Nuestros productos
					</h2>
				</div>
			</div>

			<div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{items.map((item) => (
					<InventoryItemCard key={item.id} item={item} onEdit={onEdit} />
				))}
			</div>
		</section>
	);
}
