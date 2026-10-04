"use client"

import { useState } from "react"
import type { CatalogProductOption } from "@/features/catalog/product-option"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"
import { ShoppingList } from "./shopping-list"
import { ShoppingListForm } from "./shopping-list-form"

interface ShoppingListManagerProps {
  items: ShoppingListItem[]
  products: CatalogProductOption[]
}

export function ShoppingListManager({
  items,
  products,
}: ShoppingListManagerProps) {
  const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null)

  return (
    <div className="grid gap-6 py-7 lg:grid-cols-[21rem_minmax(0,1fr)] lg:items-start lg:gap-8 lg:py-10">
      <div className="lg:sticky lg:top-6">
        <ShoppingListForm
          key={editingItem?.id ?? "new-item"}
          item={editingItem}
          products={products}
          onCancel={() => setEditingItem(null)}
          onSaved={() => setEditingItem(null)}
        />
      </div>
      <ShoppingList items={items} onEdit={setEditingItem} />
    </div>
  )
}
