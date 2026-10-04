"use server";

import { revalidatePath } from "next/cache";
import {
	type CatalogProductOption,
	toCatalogProductOption,
} from "@/features/catalog/product-option";
import { requireAuthorizedSession } from "@/lib/auth/session";
import {
	createInventoryItem,
	findInventoryItemByNameAndUnit,
} from "@/lib/db/inventory-items";
import { catalogProductInputSchema } from "@/schemas/inventory-item";

type CreateCatalogProductResult =
	| { success: true; product: CatalogProductOption; created: boolean }
	| { success: false; message: string };

export async function createCatalogProductAction(
	input: unknown,
): Promise<CreateCatalogProductResult> {
	await requireAuthorizedSession();
	const result = catalogProductInputSchema.safeParse(input);

	if (!result.success) {
		return {
			success: false,
			message: "Revisa los datos del producto e inténtalo de nuevo.",
		};
	}

	const existing = await findInventoryItemByNameAndUnit(
		result.data.name,
		result.data.unit,
	);
	if (existing) {
		return {
			success: true,
			product: toCatalogProductOption(existing),
			created: false,
		};
	}

	const id = await createInventoryItem({ ...result.data, quantity: 0 });

	revalidatePath("/inventory");
	return {
		success: true,
		product: { id, ...result.data },
		created: true,
	};
}
