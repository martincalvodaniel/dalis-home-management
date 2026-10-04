import "server-only"

import { MongoServerError, ObjectId } from "mongodb"
import { COLLECTION_NAMES, getCollection } from "@/lib/db/collections"
import { findInventoryItemsByIds } from "@/lib/db/inventory-items"
import { buildInventoryShoppingListUpdate } from "@/lib/db/shopping-list-item-update"
import type { InventoryItem } from "@/schemas/inventory-item"
import type { QuantityUnit } from "@/schemas/quantity-unit"
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

interface MealPlanShoppingListSuggestion {
  name: string
  quantity: number
  unit: QuantityUnit
  inventoryItemId: string
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

export async function findShoppingListItemById(
  id: string
): Promise<ShoppingListItem | null> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const document = await collection.findOne({ _id: toObjectId(id) })

  if (!document) {
    return null
  }

  const inventoryItemsById = await loadInventoryItemsById([document])
  return toShoppingListItem(document, inventoryItemsById)
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

export async function addMealPlanSuggestionsToShoppingList(
  suggestions: MealPlanShoppingListSuggestion[]
): Promise<void> {
  if (suggestions.length === 0) {
    return
  }

  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const now = new Date()

  await collection.bulkWrite(
    suggestions.map((suggestion) => {
      const inventoryItemId = new ObjectId(suggestion.inventoryItemId)

      return {
        updateOne: {
          filter: { inventoryItemId },
          update: [
            {
              $set: {
                name: suggestion.name,
                unit: suggestion.unit,
                quantity: {
                  $cond: [
                    { $eq: ["$isPurchased", false] },
                    {
                      $max: [
                        { $ifNull: ["$quantity", 0] },
                        suggestion.quantity,
                      ],
                    },
                    suggestion.quantity,
                  ],
                },
                inventoryItemId,
                isMealPlanGenerated: true,
                isPurchased: false,
                createdAt: { $ifNull: ["$createdAt", now] },
                updatedAt: now,
              },
            },
          ],
          upsert: true,
        },
      }
    })
  )
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

export async function markShoppingListItemPurchasedIfPending(
  id: string
): Promise<boolean> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const result = await collection.updateOne(
    { _id: toObjectId(id), isPurchased: false },
    { $set: { isPurchased: true, updatedAt: new Date() } }
  )

  return result.modifiedCount > 0
}

export async function deleteShoppingListItem(id: string): Promise<boolean> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const result = await collection.deleteOne({ _id: toObjectId(id) })

  return result.deletedCount > 0
}

export async function deletePurchasedShoppingListItems(): Promise<number> {
  const collection = await getCollection<ShoppingListItemDocument>(
    COLLECTION_NAMES.shoppingListItems
  )
  const result = await collection.deleteMany({ isPurchased: true })

  return result.deletedCount
}
