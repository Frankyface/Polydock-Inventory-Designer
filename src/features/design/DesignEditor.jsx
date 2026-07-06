import { useEffect, useRef, useState } from 'react'
import { PARTS } from '../../data/partsCatalog.js'
import { ROTATION_STEPS } from './constants.js'
import { hasFootprint } from './geometry.js'
import { makeId } from '../../lib/id.js'
import { compressImageToDataUrl } from './imageUtils.js'
import { Palette } from './Palette.jsx'
import { DesignCanvas } from './DesignCanvas.jsx'

const PARTS_BY_ID = Object.fromEntries(PARTS.map((part) => [part.id, part]))

export function DesignEditor({ design, onSave, onBack, onDirtyChange }) {
  const [name, setName] = useState(design.name)
  const [isFreeDesign, setIsFreeDesign] = useState(design.isFreeDesign)
  const [items, setItems] = useState(design.items)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(design.backgroundImage ?? null)
  const [isPositioningBackground, setIsPositioningBackground] = useState(false)
  const [backgroundError, setBackgroundError] = useState(null)
  // Guards against a second file being selected before the first one's async
  // compression finishes — without this, whichever resolves last would win
  // regardless of which file was actually picked last (same class of bug
  // fixed for CSV import in Stage 2).
  const backgroundRequestIdRef = useRef(0)

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const selectedHasFootprint = selectedItem && hasFootprint(PARTS_BY_ID[selectedItem.partId])

  const isDirty =
    name !== design.name ||
    isFreeDesign !== design.isFreeDesign ||
    JSON.stringify(items) !== JSON.stringify(design.items) ||
    JSON.stringify(backgroundImage) !== JSON.stringify(design.backgroundImage ?? null)

  // Lets the page-level nav (Inventory/Designs tabs in App.jsx) know whether
  // navigating away right now would silently discard unsaved work — without
  // this, only the in-editor "← Back" button guarded against data loss.
  useEffect(() => {
    onDirtyChange?.(isDirty)
    return () => onDirtyChange?.(false)
  }, [isDirty, onDirtyChange])

  function handleAddItem(partId) {
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
    if (!selectedItem || !selectedHasFootprint) return
    const nextIndex = (ROTATION_STEPS.indexOf(selectedItem.rotation) + 1) % ROTATION_STEPS.length
    handleUpdateItem(selectedItemId, { rotation: ROTATION_STEPS[nextIndex] })
  }

  function handleDeleteSelected() {
    if (!selectedItemId) return
    setItems((current) => current.filter((item) => item.id !== selectedItemId))
    setSelectedItemId(null)
  }

  async function handleBackgroundFile(event) {
    const file = event.target.files[0]
    event.target.value = '' // lets re-selecting the same file fire another change event
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setBackgroundError('That file is not an image — try a photo (JPG, PNG, etc).')
      return
    }

    const requestId = ++backgroundRequestIdRef.current
    setBackgroundError(null)
    try {
      const { dataUrl, naturalWidth, naturalHeight } = await compressImageToDataUrl(file)
      if (requestId !== backgroundRequestIdRef.current) return // a newer file was selected meanwhile
      setBackgroundImage((current) => ({
        // Replacing an existing background keeps its position/scale/opacity
        // calibration — only a first-ever upload gets the plain defaults.
        x: current?.x ?? 0,
        y: current?.y ?? 0,
        scale: current?.scale ?? 1,
        opacity: current?.opacity ?? 0.6,
        dataUrl,
        naturalWidth,
        naturalHeight,
      }))
      setIsPositioningBackground(true)
    } catch {
      if (requestId !== backgroundRequestIdRef.current) return
      setBackgroundError('Could not load that image — try a different file.')
    }
  }

  function handleRemoveBackground() {
    setBackgroundImage(null)
    setIsPositioningBackground(false)
  }

  function handleUpdateBackground(updates) {
    setBackgroundImage((current) => (current ? { ...current, ...updates } : current))
  }

  function handleSave() {
    onSave({ id: design.id, name: name.trim() || 'Untitled design', isFreeDesign, items, backgroundImage })
  }

  function handleBack() {
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
        <button type="button" onClick={handleRotateSelected} disabled={!selectedHasFootprint}>
          Rotate
        </button>
        <button type="button" onClick={handleDeleteSelected} disabled={!selectedItemId}>
          Delete
        </button>
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </div>

      <div className="design-editor-toolbar background-controls">
        <label className="file-input-label">
          {backgroundImage ? 'Replace background photo' : 'Add background photo'}
          <input type="file" accept="image/*" onChange={handleBackgroundFile} />
        </label>
        {backgroundError && <span className="error-text">{backgroundError}</span>}
        {backgroundImage && (
          <>
            <button
              type="button"
              className={isPositioningBackground ? 'tab tab-active' : 'tab'}
              onClick={() => setIsPositioningBackground((current) => !current)}
            >
              {isPositioningBackground ? 'Done positioning' : 'Position background'}
            </button>
            <label>
              Scale
              <input
                type="range"
                min="0.2"
                max="4"
                step="0.05"
                value={backgroundImage.scale}
                onChange={(event) => handleUpdateBackground({ scale: Number.parseFloat(event.target.value) })}
              />
            </label>
            <label>
              Opacity
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={backgroundImage.opacity}
                onChange={(event) => handleUpdateBackground({ opacity: Number.parseFloat(event.target.value) })}
              />
            </label>
            <button type="button" onClick={handleRemoveBackground}>
              Remove background
            </button>
          </>
        )}
      </div>

      <div className="design-editor-body">
        <Palette onAddItem={handleAddItem} />
        <div className="design-canvas-scroll">
          <DesignCanvas
            items={items}
            partsById={PARTS_BY_ID}
            selectedItemId={selectedItemId}
            onSelect={setSelectedItemId}
            onUpdateItem={handleUpdateItem}
            backgroundImage={backgroundImage}
            isPositioningBackground={isPositioningBackground}
            onUpdateBackground={handleUpdateBackground}
          />
        </div>
      </div>
    </div>
  )
}
