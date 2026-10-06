type PurchaseResult = { success: true } | { success: false; message: string }

interface PurchaseState {
  isPurchased: boolean
  isSaving: boolean
  error: string | null
}

interface PurchaseEntry extends PurchaseState {
  confirmed: boolean
  revision: number
}

type PurchaseItem = { id: string; isPurchased: boolean }

export class PurchaseQueue {
  private entries = new Map<string, PurchaseEntry>()

  constructor(
    private save: (id: string, isPurchased: boolean) => Promise<PurchaseResult>,
    private onChange: (states: Map<string, PurchaseState>) => void
  ) {}

  private publish() {
    this.onChange(
      new Map(Array.from(this.entries, ([id, entry]) => [id, { ...entry }]))
    )
  }

  reconcile(items: PurchaseItem[]) {
    const itemsById = new Map(items.map((item) => [item.id, item]))
    let changed = false
    for (const [id, entry] of this.entries) {
      const item = itemsById.get(id)
      if (
        !item ||
        (!entry.isSaving &&
          !entry.error &&
          item.isPurchased === entry.isPurchased)
      ) {
        this.entries.delete(id)
        changed = true
      }
    }
    if (changed) this.publish()
  }

  async toggle(
    item: PurchaseItem,
    schedule?: (save: () => Promise<void>) => void
  ): Promise<void> {
    const entry = this.entries.get(item.id) ?? {
      isPurchased: item.isPurchased,
      confirmed: item.isPurchased,
      isSaving: false,
      error: null,
      revision: 0,
    }
    entry.isPurchased = !entry.isPurchased
    entry.error = null
    entry.revision += 1
    this.entries.set(item.id, entry)

    if (entry.isSaving) {
      this.publish()
      return
    }

    entry.isSaving = true
    this.publish()

    if (schedule) {
      schedule(() => this.persist(item.id, entry))
    } else {
      await this.persist(item.id, entry)
    }
  }

  private async persist(id: string, entry: PurchaseEntry): Promise<void> {
    // Serialize writes per item while keeping the latest click visible immediately.
    while (this.entries.get(id) === entry) {
      const requested = entry.isPurchased
      const revision = entry.revision
      let error: string | null = null
      try {
        const result = await this.save(id, requested)
        if (result.success) entry.confirmed = requested
        else error = result.message
      } catch {
        error = "No se ha podido actualizar el producto."
      }

      if (this.entries.get(id) !== entry) return
      if (error && revision === entry.revision) {
        entry.isPurchased = entry.confirmed
        entry.error = error
      } else if (entry.isPurchased !== entry.confirmed) {
        continue
      }

      entry.isSaving = false
      this.publish()
      return
    }
  }
}
