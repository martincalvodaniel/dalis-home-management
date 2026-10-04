export function HomePreview() {
	return (
		<div className="relative mx-auto w-full max-w-[34rem] lg:mx-0 lg:ml-auto">
			<div
				className="absolute -inset-8 -z-10 rounded-full bg-[#dfe9d9] blur-3xl dark:bg-[#234539]"
				aria-hidden="true"
			/>
			<div className="rotate-[1.5deg] rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-[0_30px_80px_rgba(41,68,54,0.16)] backdrop-blur dark:border-white/10 dark:bg-[#162a23]/95 sm:p-4">
				<div className="rounded-[1.45rem] bg-[#edf0e5] p-5 dark:bg-[#20372e] sm:p-7">
					<div className="flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#738379] dark:text-[#aab7ae]">
								Nuestro hogar
							</p>
							<p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-[#17352b] dark:text-white sm:text-2xl">
								Todo en su sitio
							</p>
						</div>
						<div className="flex -space-x-2">
							<div className="grid size-9 place-items-center rounded-full border-2 border-[#edf0e5] bg-[#1d4f40] text-xs font-bold text-white dark:border-[#20372e]">
								D
							</div>
							<div className="grid size-9 place-items-center rounded-full border-2 border-[#edf0e5] bg-[#e8966f] text-xs font-bold text-[#43281d] dark:border-[#20372e]">
								P
							</div>
						</div>
					</div>

					<div className="mt-7 grid gap-3 sm:grid-cols-2">
						<div className="rounded-2xl bg-[#1d4f40] p-5 text-white shadow-[0_15px_35px_rgba(29,79,64,0.2)]">
							<div className="flex items-start justify-between gap-3">
								<div className="grid size-10 place-items-center rounded-xl bg-white/12">
									<svg
										viewBox="0 0 24 24"
										className="size-5"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
										aria-hidden="true"
									>
										<path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
										<path d="m4.4 7.7 7.6 4.4 7.6-4.4M12 12v9" />
									</svg>
								</div>
								<span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#dce9df]">
									Próximamente
								</span>
							</div>
							<p className="mt-6 text-sm text-[#bcd0c4]">Inventario</p>
							<p className="mt-1 text-2xl font-semibold tracking-[-0.04em]">
								Despensa al día
							</p>
						</div>

						<div className="rounded-2xl border border-[#d9ded2] bg-white p-5 dark:border-white/10 dark:bg-[#182e26]">
							<div className="flex items-center justify-between">
								<p className="text-sm font-semibold text-[#17352b] dark:text-white">
									Lista de la compra
								</p>
								<span className="grid size-8 place-items-center rounded-full bg-[#f7ded0] text-[#9c4e2e]">
									+
								</span>
							</div>
							<ul className="mt-5 space-y-3 text-sm text-[#627268] dark:text-[#b8c4bc]">
								<li className="flex items-center gap-3">
									<span className="size-4 rounded-full border-2 border-[#b8c6b8]" />
									Leche
								</li>
								<li className="flex items-center gap-3">
									<span className="size-4 rounded-full border-2 border-[#b8c6b8]" />
									Tomates
								</li>
								<li className="flex items-center gap-3 text-[#9aa59e] line-through">
									<span className="grid size-4 place-items-center rounded-full bg-[#8daf91] text-[0.6rem] text-white">
										✓
									</span>
									Café
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-3 flex items-center gap-3 rounded-2xl border border-[#d9ded2] bg-white px-4 py-3.5 dark:border-white/10 dark:bg-[#182e26]">
						<div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#f7ded0] text-lg">
							<span aria-hidden="true">⌂</span>
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-[#17352b] dark:text-white">
								Una casa más fácil de llevar
							</p>
							<p className="mt-0.5 text-xs text-[#7b8980] dark:text-[#9eaaa2]">
								Pequeñas utilidades, menos carga mental.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
