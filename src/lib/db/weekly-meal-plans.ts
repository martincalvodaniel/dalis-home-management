import "server-only"

import { MongoServerError, ObjectId } from "mongodb"
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections"
import {
  buildCopiedWeeklyMealPlanUpdate,
  buildWeeklyMealSlotMoveUpdate,
  buildWeeklyMealSlotUpdate,
} from "@/lib/db/weekly-meal-plan-update"
import type {
  WeeklyMealPlan,
  WeeklyMealSlot,
  WeeklyMealSlotInput,
  WeeklyMealSlotMoveInput,
} from "@/schemas/weekly-meal-plan"
import { addDaysToIsoDate } from "@/schemas/weekly-meal-plan"

interface WeeklyMealSlotDocument extends Omit<WeeklyMealSlot, "dishId"> {
  dishId: ObjectId
}

interface WeeklyMealPlanDocument extends Omit<WeeklyMealPlan, "id" | "slots"> {
  _id: ObjectId
  slots: WeeklyMealSlotDocument[]
}

function toWeeklyMealPlan(document: WeeklyMealPlanDocument): WeeklyMealPlan {
  return {
    id: document._id.toHexString(),
    weekStart: document.weekStart,
    slots: document.slots.map((slot) => ({
      date: slot.date,
      mealType: slot.mealType,
      dishId: slot.dishId.toHexString(),
    })),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  }
}

export async function findWeeklyMealPlan(
  weekStart: string
): Promise<WeeklyMealPlan | null> {
  const collection = await getCollection<WeeklyMealPlanDocument>(
    COLLECTION_NAMES.weeklyMealPlans
  )
  const document = await collection.findOne({ weekStart })

  return document ? toWeeklyMealPlan(document) : null
}

export async function deleteWeeklyMealPlan(
  weekStart: string
): Promise<boolean> {
  const collection = await getCollection<WeeklyMealPlanDocument>(
    COLLECTION_NAMES.weeklyMealPlans
  )
  const result = await collection.deleteOne({ weekStart })

  return result.deletedCount > 0
}

export async function isDishUsedInMealPlans(dishId: string): Promise<boolean> {
  const collection = await getCollection<WeeklyMealPlanDocument>(
    COLLECTION_NAMES.weeklyMealPlans
  )
  const document = await collection.findOne(
    { "slots.dishId": new ObjectId(dishId) },
    { projection: { _id: 1 } }
  )

  return document !== null
}

export async function setWeeklyMealSlot(
  input: WeeklyMealSlotInput
): Promise<void> {
  const collection = await getCollection<WeeklyMealPlanDocument>(
    COLLECTION_NAMES.weeklyMealPlans
  )
  const dishId = input.dishId ? new ObjectId(input.dishId) : null

  await collection.updateOne(
    { weekStart: input.weekStart },
    buildWeeklyMealSlotUpdate(input, dishId, new Date()),
    { upsert: dishId !== null }
  )
}

export async function moveWeeklyMealSlot(
  input: WeeklyMealSlotMoveInput
): Promise<boolean> {
  const collection = await getCollection<WeeklyMealPlanDocument>(
    COLLECTION_NAMES.weeklyMealPlans
  )
  const result = await collection.updateOne(
    {
      weekStart: input.weekStart,
      slots: {
        $elemMatch: {
          date: input.source.date,
          mealType: input.source.mealType,
        },
      },
    },
    buildWeeklyMealSlotMoveUpdate(input, new Date())
  )

  return result.matchedCount > 0
}

export type CopyPreviousWeekResult =
  | "copied"
  | "source-empty"
  | "target-not-empty"

export async function copyPreviousWeekIntoEmptyPlan(
  weekStart: string
): Promise<CopyPreviousWeekResult> {
  const collection = await getCollection<WeeklyMealPlanDocument>(
    COLLECTION_NAMES.weeklyMealPlans
  )
  const previousWeekStart = addDaysToIsoDate(weekStart, -7)
  const source = await collection.findOne({ weekStart: previousWeekStart })

  if (!source || source.slots.length === 0) {
    return "source-empty"
  }

  const copiedSlots = source.slots.map((slot) => ({
    ...slot,
    date: addDaysToIsoDate(slot.date, 7),
  }))

  try {
    await collection.updateOne(
      {
        weekStart,
        $or: [{ slots: { $exists: false } }, { slots: { $size: 0 } }],
      },
      buildCopiedWeeklyMealPlanUpdate(weekStart, copiedSlots, new Date()),
      { upsert: true }
    )
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return "target-not-empty"
    }

    throw error
  }

  return "copied"
}
