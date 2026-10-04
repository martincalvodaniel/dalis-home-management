import Link from "next/link";
import { HomePreview } from "./home-preview";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { UpcomingFeatures } from "./upcoming-features";

export function LandingPage() {
	return (
		<div className="min-h-screen overflow-hidden bg-[#f5f4ee] text-[#17352b] dark:bg-[#10221c] dark:text-[#f4f1e7]">
			<div className="relative">
				<div
					className="absolute left-[-10rem] top-[-14rem] size-[30rem] rounded-full bg-[#e4eadb] blur-3xl dark:bg-[#1d4035]"
					aria-hidden="true"
				/>
				<LandingHeader />

				<main>
					<section className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[minmax(0,1.02fr)_minmax(26rem,0.98fr)] lg:px-10 lg:pb-24 lg:pt-10">
						<div className="relative z-10 max-w-3xl">
							<div className="inline-flex items-center gap-2 rounded-full border border-[#d9ded3] bg-white/65 px-3.5 py-2 text-xs font-semibold text-[#52675b] shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-[#b8c7bd]">
								<span className="size-2 rounded-full bg-[#e8966f]" />
								Un hogar digital para Dani y Pali
							</div>

							<h1 className="mt-7 text-[3.35rem] font-semibold leading-[0.94] tracking-[-0.07em] text-[#17352b] dark:text-[#f7f4ea] sm:text-7xl lg:text-[5.7rem] xl:text-[6.4rem]">
								La casa en orden.
								<span className="mt-2 block font-normal italic text-[#c36d49]">
									La cabeza, más libre.
								</span>
							</h1>

							<p className="mt-7 max-w-xl text-base leading-7 text-[#5d6f65] dark:text-[#b7c2bb] sm:text-lg sm:leading-8">
								Dali reúne pequeñas utilidades para gestionar nuestro hogar sin
								complicaciones. Un lugar privado, hecho a nuestra medida y
								pensado para crecer con nosotros.
							</p>

							<div className="mt-9 flex flex-col gap-3 sm:flex-row">
								<Link
									href="/dashboard"
									className="inline-flex min-h-13 items-center justify-center rounded-full bg-[#1d4f40] px-7 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(29,79,64,0.22)] transition hover:-translate-y-0.5 hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 focus:ring-offset-[#f5f4ee] active:translate-y-0"
								>
									Abrir nuestro espacio
									<span className="ml-2 text-lg" aria-hidden="true">
										→
									</span>
								</Link>
								<Link
									href="#proximamente"
									className="inline-flex min-h-13 items-center justify-center rounded-full border border-[#ccd5ca] bg-white/55 px-7 text-sm font-semibold text-[#314d40] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 focus:ring-offset-[#f5f4ee] active:translate-y-0 dark:border-white/15 dark:bg-white/5 dark:text-[#d8e2db] dark:hover:bg-white/10"
								>
									Descubrir lo que viene
								</Link>
							</div>

							<div className="mt-10 flex items-center gap-4 text-sm text-[#718078] dark:text-[#98a79e]">
								<div className="h-px w-10 bg-[#bdc8bd] dark:bg-white/20" />
								<p>
									<span className="font-semibold text-[#3f584b] dark:text-[#c8d3cc]">
										Da
									</span>
									ni + Pa
									<span className="font-semibold text-[#3f584b] dark:text-[#c8d3cc]">
										li
									</span>
									. Así nace Dali.
								</p>
							</div>
						</div>

						<HomePreview />
					</section>

					<section className="border-y border-[#dfe2d8] bg-white/50 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 dark:border-white/10 dark:bg-white/[0.025]">
						<div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
							<div>
								<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c36d49]">
									Nuestra idea
								</p>
								<h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
									Menos apps. Más hogar.
								</h2>
							</div>
							<p className="max-w-2xl text-lg leading-8 text-[#607168] dark:text-[#b4c0b8] lg:text-xl lg:leading-9">
								No queremos otra herramienta complicada. Queremos un rincón
								común para resolver esas pequeñas tareas que se repiten cada
								semana, con la sencillez de saber que está hecho sólo para
								nosotros.
							</p>
						</div>
					</section>

					<UpcomingFeatures />

					<section className="px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
						<div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#dce8d9] px-6 py-12 text-center dark:bg-[#1b392f] sm:px-10 sm:py-16">
							<p className="text-xs font-bold uppercase tracking-[0.2em] text-[#58715f] dark:text-[#a8bcae]">
								Sólo estamos empezando
							</p>
							<h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-[#17352b] dark:text-white sm:text-5xl">
								Un hogar que funciona un poquito mejor cada día.
							</h2>
							<Link
								href="/dashboard"
								className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[#1d4f40] px-7 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 focus:ring-offset-[#dce8d9] active:translate-y-0"
							>
								Entrar en Dali
							</Link>
						</div>
					</section>
				</main>
			</div>

			<LandingFooter />
		</div>
	);
}
