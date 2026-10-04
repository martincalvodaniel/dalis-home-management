export function WeeklyMenuFeature() {
	return (
		<article className="group relative overflow-hidden rounded-[2rem] border border-[#d8d7bd] bg-[#eeeddc] p-7 text-[#303b2d] md:col-span-2 sm:p-9 dark:border-[#59624e] dark:bg-[#2e382b] dark:text-[#f4f3e7]">
			<div
				className="absolute -left-20 -top-24 size-64 rounded-full bg-[#dfe1bd]/70 blur-2xl transition-transform duration-500 group-hover:scale-110 dark:bg-[#46533e]/70"
				aria-hidden="true"
			/>
			<div className="relative grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
				<div>
					<div className="grid size-12 place-items-center rounded-2xl bg-white/65 text-[#59613d] shadow-sm dark:bg-white/10 dark:text-[#d8ddb9]">
						<svg
							viewBox="0 0 24 24"
							className="size-6"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							aria-hidden="true"
						>
							<rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
							<path d="M8 3.5v4M16 3.5v4M3.5 10h17" />
							<path d="m8 15 2 2 5-5" />
						</svg>
					</div>
					<p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-[#74794f] dark:text-[#c3c99e]">
						Menú semanal
					</p>
					<h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
						Planear la semana y comprar sólo lo que falta.
					</h3>
					<p className="mt-5 max-w-xl leading-7 text-[#626953] dark:text-[#c7cdbb]">
						Organizaremos comidas y cenas en un calendario, guardando los
						ingredientes de cada plato para reutilizarlos en semanas distintas.
						Dali cruzará el menú con el inventario y preparará la lista de la
						compra automáticamente.
					</p>

					<div className="mt-7 flex flex-wrap gap-2 text-xs font-semibold text-[#626a49] dark:text-[#d3d8ba]">
						<span className="rounded-full border border-[#cfd0ad] bg-white/45 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
							Platos reutilizables
						</span>
						<span className="rounded-full border border-[#cfd0ad] bg-white/45 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
							Ingredientes organizados
						</span>
						<span className="rounded-full border border-[#cfd0ad] bg-white/45 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
							Compra inteligente
						</span>
					</div>
				</div>

				<div className="rounded-[1.6rem] border border-white/70 bg-white/70 p-4 shadow-[0_22px_55px_rgba(75,82,52,0.12)] backdrop-blur dark:border-white/10 dark:bg-[#222d21]/80 sm:p-5">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7c8265] dark:text-[#aeb79b]">
								Esta semana
							</p>
							<p className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#303b2d] dark:text-white">
								Menú de casa
							</p>
						</div>
						<span className="rounded-full bg-[#e4e7c8] px-3 py-1.5 text-xs font-semibold text-[#616846] dark:bg-[#44513d] dark:text-[#dce1c5]">
							3 días
						</span>
					</div>

					<div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
						<div className="rounded-xl border border-[#dedfc7] bg-[#fafaf4] p-2.5 dark:border-white/10 dark:bg-white/5 sm:p-3">
							<p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8a9074] dark:text-[#aeb79b]">
								Lun
							</p>
							<div className="mt-3 rounded-lg bg-[#e7eedf] p-2 dark:bg-[#365040]">
								<p className="text-[0.6rem] text-[#7a826c] dark:text-[#b9c9bd]">
									Comida
								</p>
								<p className="mt-1 text-xs font-semibold text-[#3c503f] dark:text-white">
									Lentejas
								</p>
							</div>
							<div className="mt-2 rounded-lg bg-[#f4e3d8] p-2 dark:bg-[#503a30]">
								<p className="text-[0.6rem] text-[#967360] dark:text-[#d2b6a7]">
									Cena
								</p>
								<p className="mt-1 text-xs font-semibold text-[#664939] dark:text-white">
									Tortilla
								</p>
							</div>
						</div>

						<div className="rounded-xl border border-[#dedfc7] bg-[#fafaf4] p-2.5 dark:border-white/10 dark:bg-white/5 sm:p-3">
							<p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8a9074] dark:text-[#aeb79b]">
								Mar
							</p>
							<div className="mt-3 rounded-lg bg-[#e7eedf] p-2 dark:bg-[#365040]">
								<p className="text-[0.6rem] text-[#7a826c] dark:text-[#b9c9bd]">
									Comida
								</p>
								<p className="mt-1 text-xs font-semibold text-[#3c503f] dark:text-white">
									Pasta
								</p>
							</div>
							<div className="mt-2 rounded-lg bg-[#f4e3d8] p-2 dark:bg-[#503a30]">
								<p className="text-[0.6rem] text-[#967360] dark:text-[#d2b6a7]">
									Cena
								</p>
								<p className="mt-1 text-xs font-semibold text-[#664939] dark:text-white">
									Crema
								</p>
							</div>
						</div>

						<div className="rounded-xl border border-[#dedfc7] bg-[#fafaf4] p-2.5 dark:border-white/10 dark:bg-white/5 sm:p-3">
							<p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8a9074] dark:text-[#aeb79b]">
								Mié
							</p>
							<div className="mt-3 rounded-lg bg-[#e7eedf] p-2 dark:bg-[#365040]">
								<p className="text-[0.6rem] text-[#7a826c] dark:text-[#b9c9bd]">
									Comida
								</p>
								<p className="mt-1 text-xs font-semibold text-[#3c503f] dark:text-white">
									Arroz
								</p>
							</div>
							<div className="mt-2 rounded-lg bg-[#f4e3d8] p-2 dark:bg-[#503a30]">
								<p className="text-[0.6rem] text-[#967360] dark:text-[#d2b6a7]">
									Cena
								</p>
								<p className="mt-1 text-xs font-semibold text-[#664939] dark:text-white">
									Ensalada
								</p>
							</div>
						</div>
					</div>

					<div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#303b2d] px-4 py-3 text-white dark:bg-[#182118]">
						<div>
							<p className="text-[0.65rem] uppercase tracking-wider text-[#bec5ab]">
								Lista calculada
							</p>
							<p className="mt-0.5 text-sm font-semibold">Sólo lo que falta</p>
						</div>
						<span className="grid size-9 place-items-center rounded-full bg-white/10 text-lg">
							<span aria-hidden="true">→</span>
						</span>
					</div>
				</div>
			</div>
		</article>
	);
}
