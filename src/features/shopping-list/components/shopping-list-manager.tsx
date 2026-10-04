import { ModalDialog } from "@/components/ui/modal-dialog"
import type { CatalogProductOption } from "@/features/catalog/product-option"
import type { ShoppingListItem } from "@/schemas/shopping-list-item"
import { ShoppingList } from "./shopping-list"
import { ShoppingListForm } from "./shopping-list-form"

interface ShoppingListManagerProps {
  items: ShoppingListItem[]
  products: CatalogProductOption[]
  search: string
  onSearchChange: (search: string) => void
  editingItem: ShoppingListItem | null
  isFormOpen: boolean
  onEdit: (item: ShoppingListItem) => void
  onClose: () => void
}

export function ShoppingListManager({
  items,
  products,
  search,
  onSearchChange,
  editingItem,
  isFormOpen,
  onEdit,
  onClose,
}: ShoppingListManagerProps) {
  return (
    <div className="py-7 lg:py-10">
      <ShoppingList
        items={items}
        products={products}
        search={search}
        onSearchChange={onSearchChange}
        onEdit={onEdit}
      />
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
            initialProductSearch={search.trim()}
            onCancel={onClose}
            onSaved={onClose}
          />
        ) : null}
      </ModalDialog>
    </div>
  )
}
