import { useCallback, useEffect, useState } from 'react'
import { PARTS } from '../../data/partsCatalog.js'

const STORAGE_KEY = 'polydock:inventory:v1'

function loadQuantities() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveQuantities(quantities) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities))
}

// All inventory state lives in the browser's localStorage — there is no
// shared backend (see help.md / CLAUDE.md for why). Each browser/device has
// its own separate counts.
export function useLocalInventory() {
  const [quantities, setQuantities] = useState(() => loadQuantities())

  useEffect(() => {
    saveQuantities(quantities)
  }, [quantities])

  const setQuantity = useCallback((partId, quantity) => {
    setQuantities((current) => ({ ...current, [partId]: quantity }))
  }, [])

  // Merges many updates (e.g. a CSV import) into one state update instead of
  // one per row.
  const applyBulkQuantities = useCallback((updates) => {
    setQuantities((current) => {
      const next = { ...current }
      updates.forEach(({ partId, quantity }) => {
        next[partId] = quantity
      })
      return next
    })
  }, [])

  const parts = PARTS.map((part) => ({
    ...part,
    quantityOnHand: quantities[part.id] ?? 0,
  }))

  return { parts, setQuantity, applyBulkQuantities }
}
