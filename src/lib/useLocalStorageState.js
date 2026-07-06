import { useEffect, useState } from 'react'

// Shared read/write-to-localStorage pattern used by both inventory (Stage 1)
// and designs (Stage 3) — see docs/master_plan.md for why there's no backend.
// Returns a 3rd element (an Error, or null) so callers that care — e.g. a
// design with a large background image pushing past the browser's storage
// quota — can surface a real message instead of a silent failure. Existing
// 2-element `[value, setValue]` destructuring still works unchanged.
export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      setSaveError(null)
    } catch (error) {
      setSaveError(error)
    }
  }, [key, value])

  return [value, setValue, saveError]
}
