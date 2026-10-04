"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    href: "/",
    label: "Inicio",
    paths: ["/", "/dashboard"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="m3.5 10.5 8.5-7 8.5 7v9a1 1 0 0 1-1 1h-5v-6h-4v6h-5a1 1 0 0 1-1-1v-9Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/inventory",
    label: "Inventario",
    paths: ["/inventory"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7.5h16v12H4v-12Zm2-3h12l2 3H4l2-3Zm3 7h6"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/shopping-list",
    label: "Compra",
    paths: ["/shopping-list"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H6m4 11.5h.01m6.99 0h.01"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/meals",
    label: "Platos",
    paths: ["/meals"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 13a8 8 0 0 1 16 0H4Zm-1 0h18M12 5V3.5M6 17h12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/meal-plan",
    label: "Menú",
    paths: ["/meal-plan"],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.5 3.5v3m11-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm3 8h3v3H8v-3Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const

export function MobileBottomNavigation() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#d3dbd3] bg-[#fbfaf6]/95 shadow-[0_-10px_30px_rgba(30,57,47,0.08)] backdrop-blur-lg sm:hidden dark:border-white/10 dark:bg-[#142820]/95"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navigationItems.map((item) => {
          const isActive = item.paths.some((path) => pathname === path)

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[0.625rem] font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1d4f40] ${
                isActive
                  ? "bg-[#e3ece1] text-[#1d4f40] dark:bg-[#294b3f] dark:text-[#e7f4eb]"
                  : "text-[#718078] hover:bg-[#edf1eb] hover:text-[#294b3d] dark:text-[#aab8b0] dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <span className="size-5 [&>svg]:size-full">{item.icon}</span>
              <span className="w-full truncate text-center">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
