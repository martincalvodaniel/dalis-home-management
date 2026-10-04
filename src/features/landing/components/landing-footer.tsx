import Link from "next/link";
import { BrandMark } from "./brand-mark";

export function LandingFooter() {
	return (
		<footer className="border-t border-[#dfe2d8] px-5 py-8 sm:px-8 lg:px-10 dark:border-white/10">
			<div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
				<BrandMark />
				<div className="flex flex-col gap-2 text-sm text-[#718078] sm:items-end dark:text-[#9eaaa2]">
					<p>Hecho con cariño para nuestro hogar.</p>
					<Link
						href="/auth/signin"
						className="font-semibold text-[#1d4f40] underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-[#1d4f40] dark:text-[#b9d3c1]"
					>
						Acceso privado
					</Link>
				</div>
			</div>
		</footer>
	);
}
