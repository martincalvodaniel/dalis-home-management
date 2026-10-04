"use client"

import { useState } from "react"
import { getPurchasePlaces } from "@/features/catalog/purchase-places"
import type { InventoryItem } from "@/schemas/inventory-item"
import { InventoryForm } from "./inventory-form"
import { InventoryList } from "./inventory-list"

interface InventoryManagerProps {
  items: InventoryItem[]
}

export function InventoryManager({ items }: InventoryManagerProps) {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const purchasePlaces = getPurchasePlaces(items)

  return (
    <div className="grid gap-6 py-7 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start lg:gap-8 lg:py-10">
      <div className="lg:sticky lg:top-6">
        <InventoryForm
          key={editingItem?.id ?? `new-item-${items.length}`}
          item={editingItem}
          purchasePlaces={purchasePlaces}
          onCancel={() => setEditingItem(null)}
          onSaved={() => setEditingItem(null)}
        />
      </div>
      <InventoryList items={items} onEdit={setEditingItem} />
    </div>
  )
}
