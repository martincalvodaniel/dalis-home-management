import Link from "next/link";

export function DashboardPage() {
	return (
		<main className="flex min-h-screen items-center bg-[#f5f4ee] p-4 text-[#17352b] sm:p-8 dark:bg-[#10221c] dark:text-[#f4f1e7]">
			<section className="mx-auto w-full max-w-5xl rounded-[2rem] border border-[#dde1d8] bg-white/75 p-6 shadow-[0_24px_70px_rgba(50,72,60,0.1)] sm:p-10 dark:border-white/10 dark:bg-[#182e26]/90">
				<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c36d49]">
					Dali
				</p>
				<h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
					Nuestro espacio
				</h1>
				<p className="mt-4 max-w-2xl leading-7 text-[#63736a] dark:text-[#b4c0b8]">
					Las utilidades que Dani y Pali utilizamos para llevar la casa con
					menos esfuerzo.
				</p>

				<div className="mt-9 grid gap-4 sm:grid-cols-2">
					<Link
						href="/inventory"
						className="group rounded-2xl bg-[#1d4f40] p-6 text-white shadow-[0_15px_35px_rgba(29,79,64,0.18)] transition hover:-translate-y-0.5 hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 dark:ring-offset-[#182e26]"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bdd1c4]">
							Disponible
						</p>
						<div className="mt-3 flex items-end justify-between gap-4">
							<div>
								<h2 className="text-2xl font-semibold tracking-[-0.04em]">
									Inventario
								</h2>
								<p className="mt-2 text-sm text-[#c8d8ce]">
									Todo lo que tenemos en casa.
								</p>
							</div>
							<span
								className="text-2xl transition group-hover:translate-x-1"
								aria-hidden="true"
							>
								→
							</span>
						</div>
					</Link>
					<Link
						href="/shopping-list"
						className="group rounded-2xl border border-[#e6d8cb] bg-[#f5dfd2] p-6 text-[#563323] transition hover:-translate-y-0.5 hover:bg-[#f1d4c4] focus:outline-none focus:ring-2 focus:ring-[#a75938] focus:ring-offset-2 dark:border-[#704735] dark:bg-[#412d24] dark:text-[#fff4ed] dark:ring-offset-[#182e26]"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9c5d40] dark:text-[#e8b59c]">
							Disponible
						</p>
						<div className="mt-3 flex items-end justify-between gap-4">
							<div>
								<h2 className="text-2xl font-semibold tracking-[-0.04em]">
									Lista de la compra
								</h2>
								<p className="mt-2 text-sm text-[#77513e] dark:text-[#ebcbbb]">
									Apuntar, compartir y listo.
								</p>
							</div>
							<span
								className="text-2xl transition group-hover:translate-x-1"
								aria-hidden="true"
							>
								→
							</span>
						</div>
					</Link>
					<Link
						href="/meals"
						className="group rounded-2xl border border-[#e4d9b8] bg-[#f3e8c8] p-6 text-[#504617] transition hover:-translate-y-0.5 hover:bg-[#eee0b5] focus:outline-none focus:ring-2 focus:ring-[#75611f] focus:ring-offset-2 dark:border-[#685c38] dark:bg-[#39331f] dark:text-[#fff8d9] dark:ring-offset-[#182e26]"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6d1f] dark:text-[#dec778]">
							Disponible
						</p>
						<div className="mt-3 flex items-end justify-between gap-4">
							<div>
								<h2 className="text-2xl font-semibold tracking-[-0.04em]">
									Nuestros platos
								</h2>
								<p className="mt-2 text-sm text-[#756b3f] dark:text-[#ded3a4]">
									Ingredientes listos para el menú.
								</p>
							</div>
							<span
								className="text-2xl transition group-hover:translate-x-1"
								aria-hidden="true"
							>
								→
							</span>
						</div>
					</Link>
					<Link
						href="/meal-plan"
						className="group rounded-2xl border border-[#d4decf] bg-[#e2ecdf] p-6 text-[#294b38] transition hover:-translate-y-0.5 hover:bg-[#d7e6d3] focus:outline-none focus:ring-2 focus:ring-[#426d50] focus:ring-offset-2 dark:border-[#45614b] dark:bg-[#263d2d] dark:text-[#eff8ea] dark:ring-offset-[#182e26]"
					>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#52735b] dark:text-[#a8c9ad]">
							Disponible
						</p>
						<div className="mt-3 flex items-end justify-between gap-4">
							<div>
								<h2 className="text-2xl font-semibold tracking-[-0.04em]">
									Menú semanal
								</h2>
								<p className="mt-2 text-sm text-[#55705e] dark:text-[#bed1c0]">
									Organizar nuestras comidas y cenas.
								</p>
							</div>
							<span
								className="text-2xl transition group-hover:translate-x-1"
								aria-hidden="true"
							>
								→
							</span>
						</div>
					</Link>
				</div>
			</section>
		</main>
	);
}
