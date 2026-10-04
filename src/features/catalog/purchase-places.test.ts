import { describe, expect, test } from "bun:test"
import { getPurchasePlaces, normalizePurchasePlaces } from "./purchase-places"

describe("purchase places", () => {
  test("returns normalized, unique, alphabetized places", () => {
    expect(
      getPurchasePlaces([
        { purchasePlaces: ["  Mercado   central ", "Supermercado"] },
        { purchasePlaces: ["mercado central"] },
      ])
    ).toEqual(["Mercado central", "Supermercado"])
  })

  test("normalizes an editable list while keeping insertion order", () => {
    expect(
      normalizePurchasePlaces([" Mercado ", "Supermercado", "mercado", ""])
    ).toEqual(["Mercado", "Supermercado"])
  })
})
