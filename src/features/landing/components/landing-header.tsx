import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";

export function LandingHeader() {
	return (
		<header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10 lg:py-7">
			<Link
				href="/"
				aria-label="Ir al inicio de Dali"
				className="rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-4 focus:ring-offset-[#f5f4ee]"
			>
				<BrandMark />
			</Link>

			<nav
				aria-label="Navegación principal"
				className="flex items-center gap-2"
			>
				<Link
					href="#utilidades"
					className="hidden rounded-full px-4 py-2.5 text-sm font-medium text-[#51655a] transition hover:bg-white/70 hover:text-[#17352b] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] sm:inline-flex dark:text-[#b9c4bc] dark:hover:bg-white/10 dark:hover:text-white"
				>
					Utilidades
				</Link>
				<Link
					href="/auth/signin"
					className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d4f40] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(29,79,64,0.18)] transition hover:-translate-y-0.5 hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 focus:ring-offset-[#f5f4ee] active:translate-y-0"
				>
					Entrar
				</Link>
			</nav>
		</header>
	);
}
