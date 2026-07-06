import { useState } from 'react'
import { PARTS } from '../../data/partsCatalog.js'
import { ROTATION_STEPS } from './constants.js'
import { makeId } from '../../lib/id.js'
import { ModulePalette } from './ModulePalette.jsx'
import { DesignCanvas } from './DesignCanvas.jsx'

const PARTS_BY_ID = Object.fromEntries(PARTS.map((part) => [part.id, part]))

export function DesignEditor({ design, onSave, onBack }) {
  const [name, setName] = useState(design.name)
  const [isFreeDesign, setIsFreeDesign] = useState(design.isFreeDesign)
  const [items, setItems] = useState(design.items)
  const [selectedItemId, setSelectedItemId] = useState(null)

  function handleAddModule(partId) {
    const newItem = {
      id: makeId('item'),
      partId,
      x: 2 + (items.length % 8) * 2,
      y: 2 + Math.floor(items.length / 8) * 2,
      rotation: 0,
    }
    setItems((current) => [...current, newItem])
    setSelectedItemId(newItem.id)
  }

  function handleUpdateItem(itemId, updates) {
    setItems((current) => current.map((item) => (item.id === itemId ? { ...item, ...updates } : item)))
  }

  function handleRotateSelected() {
    if (!selectedItemId) return
    const item = items.find((candidate) => candidate.id === selectedItemId)
    if (!item) return
    const nextIndex = (ROTATION_STEPS.indexOf(item.rotation) + 1) % ROTATION_STEPS.length
    handleUpdateItem(selectedItemId, { rotation: ROTATION_STEPS[nextIndex] })
  }

  function handleDeleteSelected() {
    if (!selectedItemId) return
    setItems((current) => current.filter((item) => item.id !== selectedItemId))
    setSelectedItemId(null)
  }

  function handleSave() {
    onSave({ id: design.id, name: name.trim() || 'Untitled design', isFreeDesign, items })
  }

  function handleBack() {
    const isDirty =
      name !== design.name || isFreeDesign !== design.isFreeDesign || JSON.stringify(items) !== JSON.stringify(design.items)
    if (isDirty && !window.confirm('Discard unsaved changes to this design?')) return
    onBack()
  }

  return (
    <div className="design-editor">
      <div className="design-editor-toolbar">
        <button type="button" onClick={handleBack}>
          ← Back
        </button>
        <input value={name} onChange={(event) => setName(event.target.value)} aria-label="Design name" />
        <label>
          <input
            type="checkbox"
            checked={isFreeDesign}
            onChange={(event) => setIsFreeDesign(event.target.checked)}
          />
          Free design (ignores stock)
        </label>
        <button type="button" onClick={handleRotateSelected} disabled={!selectedItemId}>
          Rotate
        </button>
        <button type="button" onClick={handleDeleteSelected} disabled={!selectedItemId}>
          Delete
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </div>
      <div className="design-editor-body">
        <ModulePalette onAddModule={handleAddModule} />
        <div className="design-canvas-scroll">
          <DesignCanvas
            items={items}
            partsById={PARTS_BY_ID}
            selectedItemId={selectedItemId}
            onSelect={setSelectedItemId}
            onUpdateItem={handleUpdateItem}
          />
        </div>
      </div>
    </div>
  )
}
