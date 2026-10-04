import { describe, expect, test } from "bun:test"
import {
  addDaysToIsoDate,
  getWeekDates,
  weeklyMealPlanSchema,
  weeklyMealSlotInputSchema,
} from "@/schemas/weekly-meal-plan"

describe("weekly meal plan dates", () => {
  test("builds all seven dates from a Monday", () => {
    expect(getWeekDates("2026-10-05")).toEqual([
      "2026-10-05",
      "2026-10-06",
      "2026-10-07",
      "2026-10-08",
      "2026-10-09",
      "2026-10-10",
      "2026-10-11",
    ])
    expect(addDaysToIsoDate("2026-12-28", 7)).toBe("2027-01-04")
  })

  test("rejects a week that does not start on Monday", () => {
    const result = weeklyMealSlotInputSchema.safeParse({
      weekStart: "2026-10-06",
      date: "2026-10-06",
      mealType: "lunch",
      dishId: null,
    })

    expect(result.success).toBe(false)
  })

  test("rejects a slot outside the selected week", () => {
    const result = weeklyMealSlotInputSchema.safeParse({
      weekStart: "2026-10-05",
      date: "2026-10-12",
      mealType: "dinner",
      dishId: "507f1f77bcf86cd799439011",
    })

    expect(result.success).toBe(false)
  })

  test("rejects duplicate slots in a stored plan", () => {
    const now = new Date("2026-10-02T08:00:00.000Z")
    const slot = {
      date: "2026-10-05",
      mealType: "lunch" as const,
      dishId: "507f1f77bcf86cd799439011",
    }
    const result = weeklyMealPlanSchema.safeParse({
      id: "507f191e810c19729de860ea",
      weekStart: "2026-10-05",
      slots: [slot, slot],
      createdAt: now,
      updatedAt: now,
    })

    expect(result.success).toBe(false)
  })
})
