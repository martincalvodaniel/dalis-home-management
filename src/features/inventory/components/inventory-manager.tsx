"use client"

import { useState } from "react"
import { ModalDialog } from "@/components/ui/modal-dialog"
import { getPurchasePlaces } from "@/features/catalog/purchase-places"
import type { InventoryItem } from "@/schemas/inventory-item"
import { InventoryForm } from "./inventory-form"
import { InventoryList } from "./inventory-list"

interface InventoryManagerProps {
  items: InventoryItem[]
}

export function InventoryManager({ items }: InventoryManagerProps) {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const purchasePlaces = getPurchasePlaces(items)

  function closeForm() {
    setIsFormOpen(false)
    setEditingItem(null)
  }

  function editItem(item: InventoryItem) {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  return (
    <div className="py-7 lg:py-10">
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingItem(null)
            setIsFormOpen(true)
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1d4f40] px-5 text-sm font-semibold text-white transition hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 dark:ring-offset-[#10221c]"
        >
          + Añadir producto
        </button>
      </div>
      <InventoryList items={items} onEdit={editItem} />
      <ModalDialog
        open={isFormOpen}
        ariaLabel={
          editingItem ? `Editar ${editingItem.name}` : "Añadir producto"
        }
        onDismiss={closeForm}
      >
        {isFormOpen ? (
          <InventoryForm
            key={editingItem?.id ?? `new-item-${items.length}`}
            item={editingItem}
            purchasePlaces={purchasePlaces}
            onCancel={closeForm}
            onSaved={closeForm}
          />
        ) : null}
      </ModalDialog>
    </div>
  )
}
