import { useState } from 'react'
import { useDesigns } from './useDesigns.js'
import { DesignsListPage } from './DesignsListPage.jsx'
import { DesignEditor } from './DesignEditor.jsx'

const BLANK_DRAFT = { id: null, name: 'Untitled design', isFreeDesign: false, items: [] }

export function DesignsPage({ onDirtyChange }) {
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

  if (activeDesign) {
    return (
      <DesignEditor
        design={activeDesign}
        onSave={handleSave}
        onBack={() => setActiveDesignId(null)}
        onDirtyChange={onDirtyChange}
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
