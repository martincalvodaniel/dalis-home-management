"use client"

import { type FormEvent, useId, useState, useTransition } from "react"
import { ErrorBanner } from "@/components/ui/error-banner"
import { SelectField } from "@/components/ui/select-field"
import {
  createInventoryItemAction,
  updateInventoryItemAction,
} from "@/features/inventory/actions"
import {
  inventoryLocationLabels,
  inventoryUnitLabels,
} from "@/features/inventory/inventory-options"
import {
  type InventoryItem,
  inventoryItemLocations,
  inventoryItemUnits,
} from "@/schemas/inventory-item"

interface InventoryFormProps {
  item: InventoryItem | null
  onCancel: () => void
  onSaved: () => void
}

const unitOptions = inventoryItemUnits.map((unit) => ({
  value: unit,
  label: inventoryUnitLabels[unit],
}))

const locationOptions = inventoryItemLocations.map((location) => ({
  value: location,
  label: inventoryLocationLabels[location],
}))

export function InventoryForm({ item, onCancel, onSaved }: InventoryFormProps) {
  const nameId = useId()
  const quantityId = useId()
  const unitId = useId()
  const locationId = useId()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEditing = item !== null

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const form = event.currentTarget
    const formData = new FormData(form)
    const input = {
      name: formData.get("name"),
      quantity: Number(formData.get("quantity")),
      unit: formData.get("unit"),
      location: formData.get("location"),
    }

    startTransition(async () => {
      try {
        const result = item
          ? await updateInventoryItemAction(item.id, input)
          : await createInventoryItemAction(input)

        if (!result.success) {
          setError(result.message)
          return
        }

        form.reset()
        onSaved()
      } catch {
        setError("No se ha podido guardar el producto. Inténtalo de nuevo.")
      }
    })
  }

  return (
    <section className="rounded-[1.75rem] border border-[#dde1d8] bg-white/80 p-5 shadow-[0_18px_50px_rgba(50,72,60,0.08)] backdrop-blur sm:p-6 dark:border-white/10 dark:bg-[#182e26]/90">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c36d49]">
        {isEditing ? "Editar producto" : "Nuevo producto"}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
        {isEditing ? item.name : "Añadir al inventario"}
      </h2>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold" htmlFor={nameId}>
          Nombre
          <input
            id={nameId}
            name="name"
            type="text"
            required
            maxLength={120}
            defaultValue={item?.name}
            placeholder="Por ejemplo, arroz"
            className="mt-2 min-h-12 w-full rounded-xl border border-[#ccd5ca] bg-white px-4 font-normal outline-none transition placeholder:text-[#9aa59e] focus:border-[#1d4f40] focus:ring-2 focus:ring-[#1d4f40]/15 dark:border-white/15 dark:bg-[#10231c] dark:placeholder:text-[#718078]"
          />
        </label>

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-3">
          <label className="block text-sm font-semibold" htmlFor={quantityId}>
            Cantidad
            <input
              id={quantityId}
              name="quantity"
              type="number"
              min="0"
              max="999999"
              step="any"
              required
              defaultValue={item?.quantity ?? 1}
              className="mt-2 min-h-12 w-full rounded-xl border border-[#ccd5ca] bg-white px-4 font-normal outline-none transition focus:border-[#1d4f40] focus:ring-2 focus:ring-[#1d4f40]/15 dark:border-white/15 dark:bg-[#10231c]"
            />
          </label>
          <div className="block text-sm font-semibold">
            <label htmlFor={unitId}>Unidad</label>
            <SelectField
              id={unitId}
              name="unit"
              defaultValue={item?.unit ?? "unit"}
              options={unitOptions}
              className="mt-2"
            />
          </div>
        </div>

        <div className="block text-sm font-semibold">
          <label htmlFor={locationId}>Ubicación</label>
          <SelectField
            id={locationId}
            name="location"
            defaultValue={item?.location ?? "pantry"}
            options={locationOptions}
            className="mt-2"
          />
        </div>

        {error ? <ErrorBanner>{error}</ErrorBanner> : null}

        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-[#1d4f40] px-5 text-sm font-semibold text-white transition hover:bg-[#173f34] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60 dark:ring-offset-[#182e26]"
          >
            {isPending ? "Guardando…" : isEditing ? "Guardar" : "Añadir"}
          </button>
          {isEditing ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#ccd5ca] px-5 text-sm font-semibold transition hover:bg-[#edf0e9] focus:outline-none focus:ring-2 focus:ring-[#1d4f40] disabled:opacity-60 dark:border-white/15 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
