"use client";

import { useState } from "react";
import type { CatalogProductOption } from "@/features/catalog/product-option";
import type { Dish } from "@/schemas/dish";
import { DishForm } from "./dish-form";
import { DishList } from "./dish-list";

interface DishManagerProps {
	dishes: Dish[];
	products: CatalogProductOption[];
}

export function DishManager({ dishes, products }: DishManagerProps) {
	const [editingDish, setEditingDish] = useState<Dish | null>(null);

	return (
		<div className="grid gap-6 py-7 xl:grid-cols-[27rem_minmax(0,1fr)] xl:items-start xl:gap-8 xl:py-10">
			<div className="xl:sticky xl:top-6">
				<DishForm
					key={editingDish?.id ?? "new-dish"}
					dish={editingDish}
					products={products}
					onCancel={() => setEditingDish(null)}
					onSaved={() => setEditingDish(null)}
				/>
			</div>
			<DishList dishes={dishes} onEdit={setEditingDish} />
		</div>
	);
}
