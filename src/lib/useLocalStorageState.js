import { useEffect, useState } from 'react'

// Shared read/write-to-localStorage pattern used by both inventory (Stage 1)
// and designs (Stage 3) — see docs/master_plan.md for why there's no backend.
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
