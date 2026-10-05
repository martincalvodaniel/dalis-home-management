"use server"

import { revalidatePath } from "next/cache"
import { requireAuthorizedSession } from "@/lib/auth/session"
import {
  createDish,
  type DishWriteInput,
  deleteDish,
  findDishById,
  listDishes,
  updateDish,
} from "@/lib/db/dishes"
import {
  findInventoryItemsByIds,
  listInventoryItems,
  setInventoryItemQuantities,
} from "@/lib/db/inventory-items"
import { applyMealPlanShoppingListAdjustments } from "@/lib/db/shopping-list-items"
import {
  copyPreviousWeekIntoEmptyPlan,
  deleteWeeklyMealPlan,
  findWeeklyMealPlan,
  isDishUsedInMealPlans,
  moveWeeklyMealSlot,
  setWeeklyMealSlot,
} from "@/lib/db/weekly-meal-plans"
import type { DishInput } from "@/schemas/dish"
import { dishIdSchema, dishInputSchema } from "@/schemas/dish"
import { shoppingListPreparationInputSchema } from "@/schemas/shopping-list-preparation"
import {
  weeklyMealSlotInputSchema,
  weeklyMealSlotMoveInputSchema,
  weekStartSchema,
} from "@/schemas/weekly-meal-plan"
import { buildMealPlanShoppingSuggestions } from "./shopping-list-suggestions"

const MEALS_PATH = "/meals"
const MEAL_PLAN_PATH = "/meal-plan"
const SHOPPING_LIST_PATH = "/shopping-list"
const INVENTORY_PATH = "/inventory"

type DishActionResult = { success: true } | { success: false; message: string }

const invalidInputResult: DishActionResult = {
  success: false,
  message: "Revisa el plato y sus ingredientes e inténtalo de nuevo.",
}

async function resolveDishInput(
  input: DishInput
): Promise<DishWriteInput | null> {
  const productIds = input.ingredients.map(
    (ingredient) => ingredient.inventoryItemId
  )
  const products = await findInventoryItemsByIds(productIds)
  const productsById = new Map(products.map((product) => [product.id, product]))

  if (productsById.size !== productIds.length) {
    return null
  }

  return {
    name: input.name,
    ingredients: input.ingredients.map((ingredient) => {
      const product = productsById.get(ingredient.inventoryItemId)
      if (!product) {
        throw new Error(
          "Catalog product disappeared while resolving dish input"
        )
      }

      return {
        name: product.name,
        quantity: ingredient.quantity,
        unit: product.unit,
        inventoryItemId: product.id,
      }
    }),
  }
}

export async function createDishAction(
  input: unknown
): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const result = dishInputSchema.safeParse(input)

  if (!result.success) {
    return invalidInputResult
  }

  const dish = await resolveDishInput(result.data)
  if (!dish) {
    return {
      success: false,
      message: "Alguno de los productos ya no existe en el catálogo.",
    }
  }

  await createDish(dish)
  revalidatePath(MEALS_PATH)
  return { success: true }
}

export async function updateDishAction(
  id: unknown,
  input: unknown
): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const idResult = dishIdSchema.safeParse(id)
  const inputResult = dishInputSchema.safeParse(input)

  if (!idResult.success || !inputResult.success) {
    return invalidInputResult
  }

  const dish = await resolveDishInput(inputResult.data)
  if (!dish) {
    return {
      success: false,
      message: "Alguno de los productos ya no existe en el catálogo.",
    }
  }

  const updated = await updateDish(idResult.data, dish)
  if (!updated) {
    return { success: false, message: "No se ha encontrado el plato." }
  }

  revalidatePath(MEALS_PATH)
  return { success: true }
}

export async function deleteDishAction(id: unknown): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const result = dishIdSchema.safeParse(id)

  if (!result.success) {
    return invalidInputResult
  }

  if (await isDishUsedInMealPlans(result.data)) {
    return {
      success: false,
      message: "Quita este plato de los menús semanales antes de eliminarlo.",
    }
  }

  const deleted = await deleteDish(result.data)
  if (!deleted) {
    return { success: false, message: "No se ha encontrado el plato." }
  }

  revalidatePath(MEALS_PATH)
  return { success: true }
}

export async function setWeeklyMealSlotAction(
  input: unknown
): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const result = weeklyMealSlotInputSchema.safeParse(input)

  if (!result.success) {
    return {
      success: false,
      message: "Revisa la semana, el día y el plato seleccionado.",
    }
  }

  if (result.data.dishId) {
    const dish = await findDishById(result.data.dishId)
    if (!dish) {
      return { success: false, message: "No se ha encontrado el plato." }
    }
  }

  await setWeeklyMealSlot(result.data)
  revalidatePath(MEAL_PLAN_PATH)
  return { success: true }
}

export async function moveWeeklyMealSlotAction(
  input: unknown
): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const result = weeklyMealSlotMoveInputSchema.safeParse(input)

  if (!result.success) {
    return {
      success: false,
      message: "No se ha podido identificar el movimiento entre comidas.",
    }
  }

  const moved = await moveWeeklyMealSlot(result.data)
  if (!moved) {
    return {
      success: false,
      message: "La comida de origen ya no está planificada.",
    }
  }

  revalidatePath(MEAL_PLAN_PATH)
  return { success: true }
}

type PrepareShoppingListResult =
  | { success: true; itemCount: number }
  | { success: false; message: string }

type ShoppingListSuggestionsResult =
  | {
      success: true
      suggestions: ReturnType<typeof buildMealPlanShoppingSuggestions>
    }
  | { success: false; message: string }

export async function getWeeklyShoppingListSuggestionsAction(
  weekStart: unknown
): Promise<ShoppingListSuggestionsResult> {
  await requireAuthorizedSession()
  const result = weekStartSchema.safeParse(weekStart)

  if (!result.success) {
    return {
      success: false,
      message: "La semana seleccionada no es válida.",
    }
  }

  const [mealPlan, dishes, inventoryItems] = await Promise.all([
    findWeeklyMealPlan(result.data),
    listDishes(),
    listInventoryItems(),
  ])

  if (!mealPlan || mealPlan.slots.length === 0) {
    return { success: true, suggestions: [] }
  }

  return {
    success: true,
    suggestions: buildMealPlanShoppingSuggestions(
      mealPlan,
      dishes,
      inventoryItems
    ),
  }
}

export async function prepareWeeklyShoppingListAction(
  weekStart: unknown,
  input: unknown
): Promise<PrepareShoppingListResult> {
  await requireAuthorizedSession()
  const items =
    typeof input === "object" && input !== null && "items" in input
      ? input.items
      : undefined
  const result = shoppingListPreparationInputSchema.safeParse({
    weekStart,
    items,
  })

  if (!result.success) {
    return {
      success: false,
      message: "Revisa las cantidades de inventario y compra.",
    }
  }

  const [mealPlan, dishes, inventoryItems] = await Promise.all([
    findWeeklyMealPlan(result.data.weekStart),
    listDishes(),
    listInventoryItems(),
  ])

  if (!mealPlan || mealPlan.slots.length === 0) {
    return {
      success: false,
      message: "Planifica al menos una comida antes de preparar la lista.",
    }
  }

  const suggestions = buildMealPlanShoppingSuggestions(
    mealPlan,
    dishes,
    inventoryItems
  )
  const suggestionsById = new Map(
    suggestions.map((suggestion) => [suggestion.inventoryItemId, suggestion])
  )
  const containsCurrentProducts =
    suggestions.length === result.data.items.length &&
    result.data.items.every((item) => suggestionsById.has(item.inventoryItemId))

  if (!containsCurrentProducts) {
    return {
      success: false,
      message:
        "El menú o el catálogo ha cambiado. Recarga la página y revisa las cantidades.",
    }
  }

  await setInventoryItemQuantities(
    result.data.items.map((item) => ({
      inventoryItemId: item.inventoryItemId,
      quantity: item.inventoryQuantity,
    }))
  )
  await applyMealPlanShoppingListAdjustments(
    result.data.items.map((item) => {
      const suggestion = suggestionsById.get(item.inventoryItemId)
      if (!suggestion) {
        throw new Error("Validated shopping-list product is missing")
      }

      return {
        inventoryItemId: item.inventoryItemId,
        name: suggestion.name,
        unit: suggestion.unit,
        quantity: item.shoppingQuantity,
      }
    })
  )

  revalidatePath(INVENTORY_PATH)
  revalidatePath(MEAL_PLAN_PATH)
  revalidatePath(SHOPPING_LIST_PATH)

  return {
    success: true,
    itemCount: result.data.items.filter((item) => item.shoppingQuantity > 0)
      .length,
  }
}

export async function copyPreviousWeekAction(
  weekStart: unknown
): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const result = weekStartSchema.safeParse(weekStart)

  if (!result.success) {
    return { success: false, message: "La semana seleccionada no es válida." }
  }

  const copyResult = await copyPreviousWeekIntoEmptyPlan(result.data)
  if (copyResult === "source-empty") {
    return {
      success: false,
      message: "La semana anterior no tiene comidas que copiar.",
    }
  }
  if (copyResult === "target-not-empty") {
    return {
      success: false,
      message: "Esta semana ya tiene comidas y no se ha sobrescrito.",
    }
  }

  revalidatePath(MEAL_PLAN_PATH)
  return { success: true }
}

export async function clearWeeklyMealPlanAction(
  weekStart: unknown
): Promise<DishActionResult> {
  await requireAuthorizedSession()
  const result = weekStartSchema.safeParse(weekStart)

  if (!result.success) {
    return { success: false, message: "La semana seleccionada no es válida." }
  }

  const deleted = await deleteWeeklyMealPlan(result.data)
  if (!deleted) {
    return {
      success: false,
      message: "Esta semana ya estaba vacía.",
    }
  }

  revalidatePath(MEAL_PLAN_PATH)
  return { success: true }
}
