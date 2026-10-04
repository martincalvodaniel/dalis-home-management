import "server-only"

import { MongoServerError, ObjectId } from "mongodb"
import { getDatabase } from "@/lib/db/client"
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections"
import { findInventoryItemsByIds } from "@/lib/db/inventory-items"
import {
  buildMealPlanShoppingListAdjustmentOperations,
  type MealPlanShoppingListAdjustment,
} from "@/lib/db/meal-plan-shopping-list-adjustment"
import { buildInventoryShoppingListUpdate } from "@/lib/db/shopping-list-item-update"
import type { InventoryItem } from "@/schemas/inventory-item"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"

interface ShoppingListItemDocument
  extends Omit<
    ShoppingListItem,
    "id" | "inventoryItemId" | "isMealPlanGenerated"
  > {
  _id: ObjectId
  inventoryItemId: ObjectId
  isMealPlanGenerated?: boolean
}

function toShoppingListItem(
  document: ShoppingListItemDocument,
  inventoryItemsById: ReadonlyMap<string, InventoryItem>
): ShoppingListItem {
  const inventoryItemId = document.inventoryItemId.toHexString()
  const inventoryItem = inventoryItemsById.get(inventoryItemId)
  return {
    id: document._id.toHexString(),
    name: inventoryItem?.name ?? document.name,
    quantity: document.quantity,
    unit: inventoryItem?.unit ?? document.unit,
    isMealPlanGenerated: document.isMealPlanGenerated ?? false,
    isPurchased: document.isPurchased,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    inventoryItemId,
  }
}

async function loadInventoryItemsById(
  documents: readonly ShoppingListItemDocument[]
): Promise<Map<string, InventoryItem>> {
  const ids = documents.flatMap((document) => [
    document.inventoryItemId.toHexString(),
  ])
  const inventoryItems = await findInventoryItemsByIds(ids)

  return new Map(inventoryItems.map((item) => [item.id, item]))
}

function toObjectId(id: string): ObjectId {
  return new ObjectId(id)
}

export async function listShoppingListItems(): Promise<ShoppingListItem[]> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const documents = await collection
    .find({})
    .sort({ isPurchased: 1, createdAt: 1 })
    .toArray()
  const inventoryItemsById = await loadInventoryItemsById(documents)

  return documents.map((document) =>
    toShoppingListItem(document, inventoryItemsById)
  )
}

export async function isInventoryItemUsedInShoppingList(
  inventoryItemId: string
): Promise<boolean> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const document = await collection.findOne(
    { inventoryItemId: toObjectId(inventoryItemId) },
    { projection: { _id: 1 } }
  )

  return document !== null
}

export async function addInventoryItemToShoppingList(
  item: InventoryItem,
  quantity = 1
): Promise<void> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const inventoryItemId = toObjectId(item.id)
  const now = new Date()

  await collection.updateOne(
    { inventoryItemId },
    buildInventoryShoppingListUpdate(item, inventoryItemId, now, quantity),
    { upsert: true }
  )
}

export async function applyMealPlanShoppingListAdjustments(
  adjustments: readonly MealPlanShoppingListAdjustment[]
): Promise<void> {
  if (adjustments.length === 0) {
    return
  }

  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const operations = buildMealPlanShoppingListAdjustmentOperations(
    adjustments,
    new Date()
  )

  await collection.bulkWrite(operations)
}

export type UpdateShoppingListItemResult = "updated" | "missing" | "duplicate"

export async function updateShoppingListItem(
  id: string,
  item: InventoryItem,
  quantity: number
): Promise<UpdateShoppingListItemResult> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )

  try {
    const result = await collection.updateOne(
      { _id: toObjectId(id) },
      {
        $set: {
          inventoryItemId: toObjectId(item.id),
          name: item.name,
          quantity,
          unit: item.unit,
          isMealPlanGenerated: false,
          updatedAt: new Date(),
        },
      }
    )

    return result.matchedCount > 0 ? "updated" : "missing"
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return "duplicate"
    }

    throw error
  }
}

export async function setShoppingListItemPurchased(
  id: string,
  isPurchased: boolean
): Promise<boolean> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const result = await collection.updateOne(
    { _id: toObjectId(id) },
    { $set: { isPurchased, updatedAt: new Date() } }
  )

  return result.matchedCount > 0
}

export async function deleteShoppingListItem(id: string): Promise<boolean> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const result = await collection.deleteOne({ _id: toObjectId(id) })

  return result.deletedCount > 0
}

export class PurchasedShoppingListSettlementError extends Error {
  constructor() {
    super("Could not settle all purchased shopping-list items")
    this.name = "PurchasedShoppingListSettlementError"
  }
}

export async function restockAndDeletePurchasedShoppingListItems(
  ids: readonly string[]
): Promise<number> {
  const database = await getDatabase()
  const session = database.client.startSession()

  try {
    const settledCount = await session.withTransaction(async () => {
      const shoppingListCollection =
        database.collection<ShoppingListItemDocument>(
          COLLECTION_NAMES.shoppingListItems
        )
      const inventoryCollection = database.collection<{
        _id: ObjectId
        quantity: number
        updatedAt: Date
      }>(COLLECTION_NAMES.inventoryItems)
      const requestedIds = ids.map(toObjectId)
      const purchasedItems = await shoppingListCollection
        .find(
          { _id: { $in: requestedIds }, isPurchased: true },
          {
            projection: { _id: 1, inventoryItemId: 1, quantity: 1 },
            session,
          }
        )
        .toArray()

      if (purchasedItems.length === 0) {
        return 0
      }

      const now = new Date()
      const inventoryResult = await inventoryCollection.bulkWrite(
        purchasedItems.map((item) => ({
          updateOne: {
            filter: { _id: item.inventoryItemId },
            update: {
              $inc: { quantity: item.quantity },
              $set: { updatedAt: now },
            },
          },
        })),
        { session }
      )

      if (inventoryResult.matchedCount !== purchasedItems.length) {
        throw new PurchasedShoppingListSettlementError()
      }

      const purchasedIds = purchasedItems.map((item) => item._id)
      const deleteResult = await shoppingListCollection.deleteMany(
        { _id: { $in: purchasedIds }, isPurchased: true },
        { session }
      )

      if (deleteResult.deletedCount !== purchasedItems.length) {
        throw new PurchasedShoppingListSettlementError()
      }

      return deleteResult.deletedCount
    })

    return settledCount ?? 0
  } finally {
    await session.endSession()
  }
}
