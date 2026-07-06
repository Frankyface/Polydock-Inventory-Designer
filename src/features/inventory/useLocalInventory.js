import { useCallback, useMemo } from 'react'
import { PARTS } from '../../data/partsCatalog.js'
import { useLocalStorageState } from '../../lib/useLocalStorageState.js'

// All inventory state lives in the browser's localStorage — there is no
// shared backend (see help.md / CLAUDE.md for why). Each browser/device has
// its own separate counts.
export function useLocalInventory() {
  const [quantities, setQuantities, saveError] = useLocalStorageState('polydock:inventory:v1', {})

  const setQuantity = useCallback(
    (partId, quantity) => {
      setQuantities((current) => ({ ...current, [partId]: quantity }))
    },
    [setQuantities],
  )

  // Merges many ABSOLUTE quantities (e.g. a CSV import, which reports "this
  // is the actual count now") into one state update instead of one per row.
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

  // For RELATIVE adjustments (Stage 4's commit/release deducting or
  // restocking a BOM) — reads the current quantity from inside the setState
  // updater rather than a value the caller computed from a render-time
  // snapshot, so it stays correct even if two adjustments (e.g. a double-
  // clicked Commit, or a commit racing a manual edit) land back-to-back
  // before a re-render. See staging/stage-4-stock-aware-bom/feature-commit-inventory.md.
  const applyBulkDeltas = useCallback(
    (deltas) => {
      setQuantities((current) => {
        const next = { ...current }
        deltas.forEach(({ partId, delta }) => {
          next[partId] = (next[partId] ?? 0) + delta
        })
        return next
      })
    },
    [setQuantities],
  )

  // Memoized so this array's reference is stable across renders that don't
  // actually change `quantities` — downstream consumers (Stage 4's BOM/stock
  // lookups) key their own memoization off this array's identity.
  const parts = useMemo(
    () => PARTS.map((part) => ({ ...part, quantityOnHand: quantities[part.id] ?? 0 })),
    [quantities],
  )

  return { parts, setQuantity, applyBulkQuantities, applyBulkDeltas, saveError }
}
