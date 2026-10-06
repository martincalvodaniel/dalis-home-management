"use client"

import { startTransition, useEffect, useState } from "react"
import { setShoppingListItemQuantityAction } from "@/features/shopping-list/actions"
import {
  ItemUpdateQueue,
  type ItemUpdateState,
} from "@/features/shopping-list/item-update-queue"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"

export function useItemQuantities(items: ShoppingListItem[]) {
  const [states, setStates] = useState<Map<string, ItemUpdateState<number>>>(
    () => new Map()
  )
  const [queue] = useState(
    () =>
      new ItemUpdateQueue<number>(
        setShoppingListItemQuantityAction,
        setStates,
        "No se ha podido actualizar la cantidad."
      )
  )

  useEffect(() => {
    if (states.size > 0) {
      queue.reconcile(
        items.map((item) => ({ id: item.id, value: item.quantity }))
      )
    }
  }, [items, queue, states])

  function updateQuantity(item: ShoppingListItem, quantity: number) {
    if (quantity === item.quantity) return
    // Keep the quantity responsive while Server Actions save inside a transition.
    void queue.update(
      { id: item.id, value: item.quantity },
      quantity,
      startTransition
    )
  }

  return {
    items: items.map((item) => {
      const state = states.get(item.id)
      return state ? { ...item, quantity: state.value } : item
    }),
    states,
    updateQuantity,
  }
}
