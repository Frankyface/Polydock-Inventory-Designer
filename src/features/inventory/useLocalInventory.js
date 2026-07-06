import { useCallback } from 'react'
import { PARTS } from '../../data/partsCatalog.js'
import { useLocalStorageState } from '../../lib/useLocalStorageState.js'

// All inventory state lives in the browser's localStorage — there is no
// shared backend (see help.md / CLAUDE.md for why). Each browser/device has
// its own separate counts.
export function useLocalInventory() {
  const [quantities, setQuantities] = useLocalStorageState('polydock:inventory:v1', {})

  const setQuantity = useCallback(
    (partId, quantity) => {
      setQuantities((current) => ({ ...current, [partId]: quantity }))
    },
    [setQuantities],
  )

  // Merges many updates (e.g. a CSV import) into one state update instead of
  // one per row.
  const applyBulkQuantities = useCallback(
    (updates) => {
      setQuantities((current) => {
        const next = { ...current }
        updates.forEach(({ partId, quantity }) => {
          next[partId] = quantity
        })
        return next
      })
    },
    [setQuantities],
  )

  const parts = PARTS.map((part) => ({
    ...part,
    quantityOnHand: quantities[part.id] ?? 0,
  }))

  return { parts, setQuantity, applyBulkQuantities }
}
