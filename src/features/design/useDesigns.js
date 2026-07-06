import { useCallback } from 'react'
import { useLocalStorageState } from '../../lib/useLocalStorageState.js'
import { makeId } from '../../lib/id.js'

// Saved designs (module placements) persisted to localStorage — same
// per-device tradeoff as inventory (see docs/master_plan.md). A design is
// { id, name, isFreeDesign, items: [{ id, partId, x, y, rotation }],
// backgroundImage: {...} | null, updatedAt }.
export function useDesigns() {
  const [designs, setDesigns, saveError] = useLocalStorageState('polydock:designs:v1', [])

  // Takes the full initial design data so a brand-new design is only ever
  // written to localStorage once, atomically, on first Save — not the
  // instant "+ New design" is clicked. See DesignsPage.jsx: an unsaved new
  // design lives only in the editor's local state until this is called.
  //
  // Must whitelist every field DesignEditor's onSave payload can carry —
  // a field left out here (backgroundImage was, until a review caught it)
  // saves fine for an EXISTING design (saveDesign spreads ...updates) but
  // is silently dropped forever on a brand-new design's first Save, since
  // this is the only place a new design record is actually constructed.
  const createDesign = useCallback(
    (initial) => {
      const design = {
        id: makeId('design'),
        name: initial?.name?.trim() || 'Untitled design',
        isFreeDesign: initial?.isFreeDesign ?? false,
        items: initial?.items ?? [],
        backgroundImage: initial?.backgroundImage ?? null,
        updatedAt: Date.now(),
      }
      setDesigns((current) => [...current, design])
      return design.id
    },
    [setDesigns],
  )

  const saveDesign = useCallback(
    (designId, updates) => {
      setDesigns((current) =>
        current.map((design) => (design.id === designId ? { ...design, ...updates, updatedAt: Date.now() } : design)),
      )
    },
    [setDesigns],
  )

  const deleteDesign = useCallback(
    (designId) => {
      setDesigns((current) => current.filter((design) => design.id !== designId))
    },
    [setDesigns],
  )

  return { designs, createDesign, saveDesign, deleteDesign, saveError }
}
