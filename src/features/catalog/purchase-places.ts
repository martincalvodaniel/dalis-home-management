interface ProductWithPurchasePlaces {
  purchasePlaces: readonly string[]
}

export function normalizePurchasePlaceKey(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es")
}

export function normalizePurchasePlaces(values: readonly string[]): string[] {
  const placesByNormalizedName = new Map<string, string>()

  for (const value of values) {
    const place = value.trim().replace(/\s+/g, " ")
    const normalizedPlace = normalizePurchasePlaceKey(place)

    if (place && !placesByNormalizedName.has(normalizedPlace)) {
      placesByNormalizedName.set(normalizedPlace, place)
    }
  }

  return [...placesByNormalizedName.values()]
}

export function getPurchasePlaces(
  products: readonly ProductWithPurchasePlaces[]
): string[] {
  return normalizePurchasePlaces(
    products.flatMap((product) => [...product.purchasePlaces])
  ).toSorted((left, right) =>
    left.localeCompare(right, "es", { sensitivity: "base" })
  )
}
