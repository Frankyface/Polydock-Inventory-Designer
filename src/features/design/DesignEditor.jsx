import { useEffect, useMemo, useRef, useState } from 'react'
import { PARTS } from '../../data/partsCatalog.js'
import { ROTATION_STEPS } from './constants.js'
import { hasFootprint, computeSeams } from './geometry.js'
import { computeBom } from './bom.js'
import { makeId } from '../../lib/id.js'
import { compressImageToDataUrl } from './imageUtils.js'
import { Palette } from './Palette.jsx'
import { DesignCanvas } from './DesignCanvas.jsx'
import { BomPanel } from './BomPanel.jsx'

const PARTS_BY_ID = Object.fromEntries(PARTS.map((part) => [part.id, part]))

// Explicit early-return checks instead of a nested ternary — the disabled
// Commit button always has exactly one of these reasons, or none (free
// design / already committed, both handled by BomPanel's own messaging, or
// unresolved seams, which BomPanel already explains via its own separate
// "N seams need a connector" message — repeating that here would be
// redundant, so this only covers the two reasons unique to this slot).
function getCommitBlockedReason({ isFreeDesign, isLocked, design, unresolvedCount, isBuildable }) {
  if (isFreeDesign || isLocked) return null
  if (!design.id) return 'Save this design before committing.'
  if (unresolvedCount > 0) return null
  if (!isBuildable) return 'Not enough stock on hand for one or more parts below.'
  return null
}

export function DesignEditor({ design, onSave, onBack, onDirtyChange, inventoryParts, onCommit, onRelease }) {
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
  // Blocks a rapid double-click on Commit/Release from firing the action
  // twice before design.isCommitted's new value has propagated back down as
  // a prop — a ref (not state) so the SECOND click, arriving before any
  // re-render, still sees it set. Shared by both actions since they're
  // mutually exclusive; reset whenever the commit state actually changes.
  const isSubmittingRef = useRef(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    isSubmittingRef.current = false
    setIsSubmitting(false)
  }, [design.isCommitted])

  // Read directly from the `design` prop (not copied into local state) so it
  // stays reactive to a commit/release that happened just now, without the
  // component needing to remount — see staging/stage-4-stock-aware-bom/.
  const isLocked = Boolean(design.isCommitted)

  const selectedItem = items.find((item) => item.id === selectedItemId)
  const selectedHasFootprint = selectedItem && hasFootprint(PARTS_BY_ID[selectedItem.partId])

  // Defends against a design whose saved items reference a partId that no
  // longer exists in the catalog (e.g. after a future catalog change) —
  // skips just that item instead of crashing the canvas or the BOM. Single
  // source of truth shared by DesignCanvas (rendering) and the BOM below —
  // previously computed separately inside DesignCanvas.
  const validItems = useMemo(() => items.filter((item) => PARTS_BY_ID[item.partId]), [items])
  const footprintItems = useMemo(() => validItems.filter((item) => hasFootprint(PARTS_BY_ID[item.partId])), [validItems])
  const markerItems = useMemo(() => validItems.filter((item) => !hasFootprint(PARTS_BY_ID[item.partId])), [validItems])
  const seams = useMemo(() => computeSeams(footprintItems, PARTS_BY_ID), [footprintItems])

  const { lines: bomLines, unresolvedCount } = useMemo(
    () => computeBom(footprintItems, markerItems, seams, PARTS_BY_ID),
    [footprintItems, markerItems, seams],
  )

  const inventoryByPartId = useMemo(() => Object.fromEntries(inventoryParts.map((part) => [part.id, part])), [inventoryParts])
  const stockedBomLines = useMemo(
    () =>
      bomLines.map((line) => {
        const quantityOnHand = inventoryByPartId[line.partId]?.quantityOnHand ?? 0
        return { ...line, quantityOnHand, shortfall: Math.max(0, line.quantity - quantityOnHand) }
      }),
    [bomLines, inventoryByPartId],
  )
  const isBuildable = unresolvedCount === 0 && stockedBomLines.every((line) => line.shortfall === 0)
  const canCommit = Boolean(design.id) && !isFreeDesign && !isLocked && isBuildable
  const commitBlockedReason = getCommitBlockedReason({ isFreeDesign, isLocked, design, unresolvedCount, isBuildable })

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
    if (isLocked) return
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
    if (isLocked || !selectedItem || !selectedHasFootprint) return
    const nextIndex = (ROTATION_STEPS.indexOf(selectedItem.rotation) + 1) % ROTATION_STEPS.length
    handleUpdateItem(selectedItemId, { rotation: ROTATION_STEPS[nextIndex] })
  }

  function handleDeleteSelected() {
    if (isLocked || !selectedItemId) return
    setItems((current) => current.filter((item) => item.id !== selectedItemId))
    setSelectedItemId(null)
  }

  async function handleBackgroundFile(event) {
    const file = event.target.files[0]
    event.target.value = '' // lets re-selecting the same file fire another change event
    if (!file || isLocked) return

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
    if (isLocked) return
    setBackgroundImage(null)
    setIsPositioningBackground(false)
  }

  function handleUpdateBackground(updates) {
    if (isLocked) return
    setBackgroundImage((current) => (current ? { ...current, ...updates } : current))
  }

  function handleSave() {
    if (isLocked) return
    onSave({ id: design.id, name: name.trim() || 'Untitled design', isFreeDesign, items, backgroundImage })
  }

  // Unlike handleSave, this doesn't navigate back to the list — the user
  // stays on the editor to see the "Committed" state and Release option.
  // Saves the current canvas state alongside the commit so what's recorded
  // as deducted always matches what's actually on the canvas at commit time.
  // Guarded by isSubmittingRef (a ref, not state) so a rapid double-click
  // can't fire onCommit twice before design.isCommitted propagates back down.
  function handleCommit() {
    if (!canCommit || isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    const payload = { id: design.id, name: name.trim() || 'Untitled design', isFreeDesign, items, backgroundImage }
    const bomForCommit = stockedBomLines.map(({ partId, quantity }) => ({ partId, quantity }))
    onCommit(payload, bomForCommit)
  }

  function handleRelease() {
    if (isSubmittingRef.current) return
    isSubmittingRef.current = true
    setIsSubmitting(true)
    onRelease(design)
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
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label="Design name"
          disabled={isLocked}
        />
        <label>
          <input
            type="checkbox"
            checked={isFreeDesign}
            onChange={(event) => setIsFreeDesign(event.target.checked)}
            disabled={isLocked}
          />
          Free design (ignores stock)
        </label>
        <button type="button" onClick={handleRotateSelected} disabled={!selectedHasFootprint || isLocked}>
          Rotate
        </button>
        <button type="button" onClick={handleDeleteSelected} disabled={!selectedItemId || isLocked}>
          Delete
        </button>
        <button type="button" onClick={handleSave} disabled={isLocked}>
          Save
        </button>
        {isLocked && <span className="badge-committed">Committed — release to edit</span>}
      </div>

      <div className="design-editor-toolbar background-controls">
        <label className="file-input-label">
          {backgroundImage ? 'Replace background photo' : 'Add background photo'}
          <input type="file" accept="image/*" onChange={handleBackgroundFile} disabled={isLocked} />
        </label>
        {backgroundError && <span className="error-text">{backgroundError}</span>}
        {backgroundImage && (
          <>
            <button
              type="button"
              className={isPositioningBackground ? 'tab tab-active' : 'tab'}
              onClick={() => setIsPositioningBackground((current) => !current)}
              disabled={isLocked}
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
                disabled={isLocked}
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
                disabled={isLocked}
              />
            </label>
            <button type="button" onClick={handleRemoveBackground} disabled={isLocked}>
              Remove background
            </button>
          </>
        )}
      </div>

      <div className="design-editor-body">
        <Palette onAddItem={handleAddItem} disabled={isLocked} />
        <div className="design-canvas-scroll">
          <DesignCanvas
            footprintItems={footprintItems}
            markerItems={markerItems}
            seams={seams}
            partsById={PARTS_BY_ID}
            selectedItemId={selectedItemId}
            onSelect={setSelectedItemId}
            onUpdateItem={handleUpdateItem}
            backgroundImage={backgroundImage}
            isPositioningBackground={isPositioningBackground}
            onUpdateBackground={handleUpdateBackground}
            isLocked={isLocked}
          />
        </div>
      </div>

      <BomPanel
        lines={stockedBomLines}
        unresolvedCount={unresolvedCount}
        isFreeDesign={isFreeDesign}
        isCommitted={isLocked}
        canCommit={canCommit && !isSubmitting}
        canRelease={!isSubmitting}
        commitBlockedReason={commitBlockedReason}
        onCommit={handleCommit}
        onRelease={handleRelease}
      />
    </div>
  )
}
