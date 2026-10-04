import Link from "next/link";
import { WeeklyMenuFeature } from "./weekly-menu-feature";

export function UpcomingFeatures() {
	return (
		<section
			id="proximamente"
			className="scroll-mt-8 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
		>
			<div className="mx-auto max-w-7xl">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c36d49]">
						Disponible y lo próximo
					</p>
					<h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#17352b] dark:text-[#f4f1e7] sm:text-5xl">
						Empezamos a poner la casa en orden.
					</h2>
					<p className="mt-5 text-base leading-7 text-[#617168] dark:text-[#b4c0b8] sm:text-lg">
						El inventario ya está listo. Dali seguirá creciendo poco a poco con
						utilidades sencillas para nuestra casa.
					</p>
				</div>

				<div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
					<Link
						href="/inventory"
						className="group relative overflow-hidden rounded-[2rem] bg-[#1d4f40] p-7 text-white shadow-[0_20px_50px_rgba(29,79,64,0.15)] transition hover:-translate-y-1 hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-4 focus:ring-offset-[#f5f4ee] sm:p-9"
					>
						<div
							className="absolute -right-16 -top-16 size-52 rounded-full border-[36px] border-white/5 transition-transform duration-500 group-hover:scale-110"
							aria-hidden="true"
						/>
						<div className="relative">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/10">
								<svg
									viewBox="0 0 24 24"
									className="size-6"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden="true"
								>
									<path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
									<path d="m4.4 7.7 7.6 4.4 7.6-4.4M12 12v9" />
								</svg>
							</div>
							<p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#bcd0c4]">
								Inventario · Disponible
							</p>
							<h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
								Saber qué tenemos, sin rebuscar.
							</h3>
							<p className="mt-5 max-w-md leading-7 text-[#c8d8ce]">
								Añade, organiza y actualiza lo que tenemos en casa. Pulsa para
								abrir nuestro inventario compartido.
							</p>
							<span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
								Abrir inventario
								<span
									className="transition group-hover:translate-x-1"
									aria-hidden="true"
								>
									→
								</span>
							</span>
						</div>
					</Link>

					<article className="group relative overflow-hidden rounded-[2rem] border border-[#e6d8cb] bg-[#f5dfd2] p-7 text-[#563323] sm:p-9 dark:border-[#774c38] dark:bg-[#4a3025] dark:text-[#fff4ed]">
						<div
							className="absolute -bottom-20 -right-12 size-56 rounded-full bg-[#edb293]/50 transition-transform duration-500 group-hover:scale-110 dark:bg-[#8c5942]/50"
							aria-hidden="true"
						/>
						<div className="relative">
							<div className="grid size-12 place-items-center rounded-2xl bg-white/55 dark:bg-white/10">
								<svg
									viewBox="0 0 24 24"
									className="size-6"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.8"
									aria-hidden="true"
								>
									<path d="M5 6h14l-1.2 8.5a2 2 0 0 1-2 1.7H8.2a2 2 0 0 1-2-1.7L5 6Z" />
									<path d="M8.5 6a3.5 3.5 0 0 1 7 0M9 20h.01M16 20h.01" />
								</svg>
							</div>
							<p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c5d40] dark:text-[#e8b59c]">
								Lista de la compra
							</p>
							<h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
								Apuntar, compartir y listo.
							</h3>
							<p className="mt-5 max-w-md leading-7 text-[#77513e] dark:text-[#ebcbbb]">
								Una lista común para Dani y Pali, conectada con el inventario y
								siempre disponible cuando haga falta.
							</p>
						</div>
					</article>

					<WeeklyMenuFeature />
				</div>
			</div>
		</section>
	);
}
