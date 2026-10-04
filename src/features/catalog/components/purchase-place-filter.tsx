"use client"

interface PurchasePlaceFilterProps {
  places: string[]
  activePlace: string
  onPlaceChange: (place: string) => void
}

export function PurchasePlaceFilter({
  places,
  activePlace,
  onPlaceChange,
}: PurchasePlaceFilterProps) {
  return (
    <nav
      className="mt-4 flex gap-2 overflow-x-auto pb-1"
      aria-label="Filtrar por lugar de compra"
    >
      {["*", ...places].map((place) => {
        const isActive = activePlace === place

        return (
          <button
            key={place}
            type="button"
            onClick={() => onPlaceChange(place)}
            aria-pressed={isActive}
            className={`min-h-9 shrink-0 rounded-full border px-3 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#1d4f40] ${isActive ? "border-[#1d4f40] bg-[#1d4f40] text-white dark:border-[#8bb9a6] dark:bg-[#8bb9a6] dark:text-[#10221c]" : "border-[#ccd5ca] bg-white/65 text-[#5f7167] hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-[#c4d0c8] dark:hover:bg-white/10"}`}
          >
            {place}
          </button>
        )
      })}
    </nav>
  )
}
