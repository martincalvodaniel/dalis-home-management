import type { Metadata } from "next";
import { ShoppingListPage } from "@/features/shopping-list/components/shopping-list-page";
import { listShoppingListItems } from "@/lib/db/shopping-list-items";

export const metadata: Metadata = {
	title: "Lista de la compra — Dali",
	description: "Lista de la compra compartida de Dani y Pali.",
};

export default async function ShoppingListRoute() {
	const items = await listShoppingListItems();

	return <ShoppingListPage items={items} />;
}
