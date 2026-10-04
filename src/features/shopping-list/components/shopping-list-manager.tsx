import { ModalDialog } from "@/components/ui/modal-dialog"
import type { CatalogProductOption } from "@/features/catalog/product-option"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"
import { ShoppingList } from "./shopping-list"
import { ShoppingListForm } from "./shopping-list-form"

interface ShoppingListManagerProps {
  items: ShoppingListItem[]
  products: CatalogProductOption[]
  editingItem: ShoppingListItem | null
  isFormOpen: boolean
  onEdit: (item: ShoppingListItem) => void
  onClose: () => void
}

export function ShoppingListManager({
  items,
  products,
  editingItem,
  isFormOpen,
  onEdit,
  onClose,
}: ShoppingListManagerProps) {
  return (
    <div className="py-7 lg:py-10">
      <ShoppingList items={items} products={products} onEdit={onEdit} />
      <ModalDialog
        open={isFormOpen}
        ariaLabel={
          editingItem ? `Editar ${editingItem.name}` : "Añadir producto"
        }
        onDismiss={onClose}
      >
        {isFormOpen ? (
          <ShoppingListForm
            key={editingItem?.id ?? "new-item"}
            item={editingItem}
            products={products}
            onCancel={onClose}
            onSaved={onClose}
          />
        ) : null}
      </ModalDialog>
    </div>
  )
}
