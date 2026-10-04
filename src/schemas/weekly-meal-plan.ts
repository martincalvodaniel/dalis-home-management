import { z } from "zod"

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/
const objectIdSchema = z.string().regex(/^[0-9a-f]{24}$/i)

export const mealTypes = ["lunch", "dinner"] as const
export const mealTypeSchema = z.enum(mealTypes)

function parseIsoDate(value: string): Date | null {
  if (!isoDatePattern.test(value)) {
    return null
  }

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year ?? 0, (month ?? 0) - 1, day))
  const isExactDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === (month ?? 0) - 1 &&
    date.getUTCDate() === day

  return isExactDate ? date : null
}

function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function addDaysToIsoDate(value: string, days: number): string {
  const date = parseIsoDate(value)
  if (!date) {
    throw new Error(`Invalid ISO date: ${value}`)
  }

  date.setUTCDate(date.getUTCDate() + days)
  return formatIsoDate(date)
}

export function getWeekDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) =>
    addDaysToIsoDate(weekStart, index)
  )
}

export const isoDateSchema = z
  .string()
  .refine((value) => parseIsoDate(value) !== null, {
    message: "Expected a valid date in YYYY-MM-DD format",
  })

export const weekStartSchema = isoDateSchema.refine(
  (value) => parseIsoDate(value)?.getUTCDay() === 1,
  { message: "Week start must be a Monday" }
)

export const weeklyMealSlotSchema = z.object({
  date: isoDateSchema,
  mealType: mealTypeSchema,
  dishId: objectIdSchema,
})

export const weeklyMealPlanSchema = z
  .object({
    id: objectIdSchema,
    weekStart: weekStartSchema,
    slots: z.array(weeklyMealSlotSchema).max(14),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .superRefine((plan, context) => {
    const weekDates = new Set(getWeekDates(plan.weekStart))
    const slotKeys = new Set<string>()

    for (const [index, slot] of plan.slots.entries()) {
      if (!weekDates.has(slot.date)) {
        context.addIssue({
          code: "custom",
          message: "Meal slot date must belong to the selected week",
          path: ["slots", index, "date"],
        })
      }

      const slotKey = `${slot.date}:${slot.mealType}`
      if (slotKeys.has(slotKey)) {
        context.addIssue({
          code: "custom",
          message: "Meal slots must be unique within a week",
          path: ["slots", index],
        })
      }
      slotKeys.add(slotKey)
    }
  })

export const weeklyMealSlotInputSchema = z
  .object({
    weekStart: weekStartSchema,
    date: isoDateSchema,
    mealType: mealTypeSchema,
    dishId: objectIdSchema.nullable(),
  })
  .strict()
  .superRefine((input, context) => {
    if (!getWeekDates(input.weekStart).includes(input.date)) {
      context.addIssue({
        code: "custom",
        message: "Meal slot date must belong to the selected week",
        path: ["date"],
      })
    }
  })

export type MealType = z.infer<typeof mealTypeSchema>
export type WeeklyMealSlot = z.infer<typeof weeklyMealSlotSchema>
export type WeeklyMealPlan = z.infer<typeof weeklyMealPlanSchema>
export type WeeklyMealSlotInput = z.infer<typeof weeklyMealSlotInputSchema>
