import Link from "next/link";
import type { InventoryItem } from "@/schemas/inventory-item";
import { InventoryManager } from "./inventory-manager";

interface InventoryPageProps {
	items: InventoryItem[];
}

export function InventoryPage({ items }: InventoryPageProps) {
	return (
		<main className="min-h-screen bg-[#f5f4ee] px-4 py-5 text-[#17352b] sm:px-8 sm:py-8 dark:bg-[#10221c] dark:text-[#f4f1e7]">
			<div className="mx-auto w-full max-w-7xl">
				<header className="flex flex-col gap-5 border-b border-[#d9ded3] pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-white/10">
					<div>
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#5f7167] transition hover:text-[#17352b] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:text-[#aebcb3] dark:hover:text-white"
						>
							<span aria-hidden="true">←</span>
							Dali
						</Link>
						<p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#c36d49]">
							Nuestro hogar
						</p>
						<h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
							Inventario
						</h1>
						<p className="mt-3 max-w-2xl text-sm leading-6 text-[#63736a] sm:text-base dark:text-[#b4c0b8]">
							Todo lo que tenemos en casa, visible de un vistazo para Dani y
							Pali.
						</p>
					</div>
					<div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d6ddd3] bg-white/65 px-4 py-2 text-sm font-semibold text-[#53675c] dark:border-white/10 dark:bg-white/5 dark:text-[#c4d0c8]">
						<span className="size-2 rounded-full bg-[#7fa184]" />
						{items.length} {items.length === 1 ? "producto" : "productos"}
					</div>
				</header>

				<InventoryManager items={items} />
			</div>
		</main>
	);
}
