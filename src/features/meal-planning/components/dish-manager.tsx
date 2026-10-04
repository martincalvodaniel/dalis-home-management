"use client"

import { useState } from "react"
import { ModalDialog } from "@/components/ui/modal-dialog"
import type { CatalogProductOption } from "@/features/catalog/product-option"
import type { Dish } from "@/schemas/dish"
import { DishForm } from "./dish-form"
import { DishList } from "./dish-list"

interface DishManagerProps {
  dishes: Dish[]
  products: CatalogProductOption[]
}

export function DishManager({ dishes, products }: DishManagerProps) {
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  function closeForm() {
    setIsFormOpen(false)
    setEditingDish(null)
  }

  function editDish(dish: Dish) {
    setEditingDish(dish)
    setIsFormOpen(true)
  }

  return (
    <div className="py-7 xl:py-10">
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingDish(null)
            setIsFormOpen(true)
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#75611f] px-5 text-sm font-semibold text-white transition hover:bg-[#615018] focus:outline-none focus:ring-2 focus:ring-[#75611f] focus:ring-offset-2 dark:ring-offset-[#10221c]"
        >
          + Añadir plato
        </button>
      </div>
      <DishList dishes={dishes} onEdit={editDish} />
      <ModalDialog
        open={isFormOpen}
        ariaLabel={editingDish ? `Editar ${editingDish.name}` : "Añadir plato"}
        size="lg"
        onDismiss={closeForm}
      >
        {isFormOpen ? (
          <DishForm
            key={editingDish?.id ?? "new-dish"}
            dish={editingDish}
            products={products}
            onCancel={closeForm}
            onSaved={closeForm}
          />
        ) : null}
      </ModalDialog>
    </div>
  )
}
