import { useState } from 'react'
import { useDesigns } from './useDesigns.js'
import { DesignsListPage } from './DesignsListPage.jsx'
import { DesignEditor } from './DesignEditor.jsx'

const BLANK_DRAFT = { id: null, name: 'Untitled design', isFreeDesign: false, items: [] }

export function DesignsPage({ onDirtyChange, inventoryParts, applyBulkDeltas }) {
  const { designs, createDesign, saveDesign, deleteDesign, saveError } = useDesigns()
  // 'draft' means a brand-new, not-yet-saved design — nothing is written to
  // localStorage for it until Save is clicked, so backing out of a design
  // someone never touched leaves zero trace (see useDesigns.js).
  const [activeDesignId, setActiveDesignId] = useState(null)

  const activeDesign = activeDesignId === 'draft' ? BLANK_DRAFT : designs.find((design) => design.id === activeDesignId)

  function handleSave(updates) {
    if (activeDesign.id) {
      saveDesign(activeDesign.id, updates)
    } else {
      createDesign(updates)
    }
    setActiveDesignId(null)
  }

  // Deducts the BOM from on-hand inventory (as relative deltas — see
  // applyBulkDeltas — so this stays correct even against concurrent inventory
  // changes) and saves the design's current canvas state plus the commit
  // record together — "committed" always reflects exactly what was actually
  // deducted. Doesn't navigate away, unlike handleSave, so the user sees the
  // committed state and Release option immediately.
  function handleCommit(payload, bomLines) {
    applyBulkDeltas(bomLines.map(({ partId, quantity }) => ({ partId, delta: -quantity })))
    saveDesign(payload.id, { ...payload, isCommitted: true, committedBom: bomLines })
  }

  // Adds the design's committed BOM back to on-hand inventory and clears the
  // commit record — full release only (see
  // staging/stage-4-stock-aware-bom/feature-commit-inventory.md).
  function handleRelease(design) {
    applyBulkDeltas((design.committedBom ?? []).map(({ partId, quantity }) => ({ partId, delta: quantity })))
    saveDesign(design.id, { isCommitted: false, committedBom: null })
  }

  if (activeDesign) {
    return (
      <DesignEditor
        design={activeDesign}
        onSave={handleSave}
        onBack={() => setActiveDesignId(null)}
        onDirtyChange={onDirtyChange}
        inventoryParts={inventoryParts}
        onCommit={handleCommit}
        onRelease={handleRelease}
      />
    )
  }

  return (
    <DesignsListPage
      designs={designs}
      onCreate={() => setActiveDesignId('draft')}
      onSelect={setActiveDesignId}
      onDelete={deleteDesign}
      saveError={saveError}
    />
  )
}
