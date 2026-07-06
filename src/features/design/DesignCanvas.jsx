import { useRef, useState } from 'react'
import { CANVAS_WIDTH_FT, CANVAS_HEIGHT_FT, PIXELS_PER_FOOT, DEFAULT_BACKGROUND_WIDTH_FT } from './constants.js'
import { getFootprint, getBounds, hasFootprint, computeSnappedPosition } from './geometry.js'
import { GridLines } from './GridLines.jsx'
import { PlacedModuleShape } from './PlacedModuleShape.jsx'
import { AccessoryMarker } from './AccessoryMarker.jsx'
import { SeamLine } from './SeamLine.jsx'

// The live on-screen position for an item: its dragged (not-yet-committed)
// position while it's the one being dragged, otherwise its saved position.
// Shared by the footprint-item and marker-item render loops below.
function getDisplayPosition(item, dragState) {
  if (dragState?.itemId === item.id) return { x: dragState.currentX, y: dragState.currentY }
  return { x: item.x, y: item.y }
}

export function DesignCanvas({
  footprintItems,
  markerItems,
  seams,
  partsById,
  selectedItemId,
  onSelect,
  onUpdateItem,
  backgroundImage,
  isPositioningBackground,
  onUpdateBackground,
  isLocked,
}) {
  const svgRef = useRef(null)
  // { itemId, offsetX, offsetY (pointer-to-item-origin offset, in ft),
  //   currentX, currentY, hasMoved }
  const [dragState, setDragState] = useState(null)
  // { offsetX, offsetY } in ft, from pointer to the background image's origin.
  // Mutually exclusive with dragState by construction — see the guards in
  // handlePointerDown/handleBackgroundPointerDown below, not just handler
  // ordering (a bare pointerId race could otherwise let both be set at once).
  const [bgDragOffset, setBgDragOffset] = useState(null)

  function toFeet(clientX, clientY) {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: (clientX - rect.left) / PIXELS_PER_FOOT, y: (clientY - rect.top) / PIXELS_PER_FOOT }
  }

  function handleBackgroundPointerDown(event) {
    if (dragState || isLocked) return // an item drag is already in progress, or a committed design freezes it too
    event.stopPropagation()
    const point = toFeet(event.clientX, event.clientY)
    setBgDragOffset({ offsetX: point.x - backgroundImage.x, offsetY: point.y - backgroundImage.y })
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // ignored — see handlePointerDown's identical comment below
    }
  }

  function handlePointerDown(event, item) {
    if (bgDragOffset || isLocked) return // background drag in progress, or a committed design freezes item edits
    event.stopPropagation()
    onSelect(item.id)
    const point = toFeet(event.clientX, event.clientY)
    setDragState({
      itemId: item.id,
      offsetX: point.x - item.x,
      offsetY: point.y - item.y,
      currentX: item.x,
      currentY: item.y,
      hasMoved: false,
    })
    try {
      // Keeps the drag tracking this element even if the pointer moves
      // faster than the browser can re-target events. Best-effort: some
      // environments (e.g. synthetic/non-trusted pointer events) can reject
      // this — the move/up handlers are on the SVG root (not this element),
      // so dragging still works correctly either way.
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // ignored — see comment above
    }
  }

  function handlePointerMove(event) {
    if (bgDragOffset) {
      const point = toFeet(event.clientX, event.clientY)
      onUpdateBackground({ x: point.x - bgDragOffset.offsetX, y: point.y - bgDragOffset.offsetY })
      return
    }
    if (!dragState) return
    const point = toFeet(event.clientX, event.clientY)
    setDragState((current) => ({
      ...current,
      currentX: Math.max(0, point.x - current.offsetX),
      currentY: Math.max(0, point.y - current.offsetY),
      hasMoved: true,
    }))
  }

  function endDrag() {
    if (bgDragOffset) {
      setBgDragOffset(null)
      return
    }
    if (!dragState) return
    // A plain click (pointerdown immediately followed by pointerup, no real
    // movement) already selected the item in handlePointerDown — leave its
    // position untouched rather than re-running the snap logic for nothing.
    if (!dragState.hasMoved) {
      setDragState(null)
      return
    }
    const item = footprintItems.find((candidate) => candidate.id === dragState.itemId) ??
      markerItems.find((candidate) => candidate.id === dragState.itemId)
    if (!item) {
      setDragState(null)
      return
    }
    const part = partsById[item.partId]

    // Accessories have no footprint to snap — drop them exactly where released.
    if (!hasFootprint(part)) {
      onUpdateItem(item.id, { x: dragState.currentX, y: dragState.currentY })
      setDragState(null)
      return
    }

    const { width, height } = getFootprint(part, item.rotation)
    const draggedBounds = {
      x0: dragState.currentX,
      y0: dragState.currentY,
      x1: dragState.currentX + width,
      y1: dragState.currentY + height,
    }
    const neighborBounds = footprintItems
      .filter((candidate) => candidate.id !== item.id)
      .map((candidate) => getBounds(candidate, partsById[candidate.partId]))
    const snapped = computeSnappedPosition(draggedBounds, neighborBounds)
    onUpdateItem(item.id, { x: Math.max(0, snapped.x), y: Math.max(0, snapped.y) })
    setDragState(null)
  }

  const backgroundWidthFt = backgroundImage ? DEFAULT_BACKGROUND_WIDTH_FT * backgroundImage.scale : 0
  const backgroundHeightFt = backgroundImage
    ? backgroundWidthFt * (backgroundImage.naturalHeight / backgroundImage.naturalWidth)
    : 0

  return (
    <svg
      ref={svgRef}
      width={CANVAS_WIDTH_FT * PIXELS_PER_FOOT}
      height={CANVAS_HEIGHT_FT * PIXELS_PER_FOOT}
      className="design-canvas"
      onClick={(event) => {
        // A plain click on a module fires pointerdown (which selects it) and
        // then a native 'click' event that bubbles up to this same handler —
        // only deselect when the click originated on the canvas background
        // itself, not a module (stopPropagation on pointerdown doesn't stop
        // the later 'click' event, which is a separate event type).
        if (event.target === event.currentTarget) onSelect(null)
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {backgroundImage && (
        <image
          href={backgroundImage.dataUrl}
          x={backgroundImage.x * PIXELS_PER_FOOT}
          y={backgroundImage.y * PIXELS_PER_FOOT}
          width={backgroundWidthFt * PIXELS_PER_FOOT}
          height={backgroundHeightFt * PIXELS_PER_FOOT}
          opacity={backgroundImage.opacity}
          preserveAspectRatio="none"
          // Purely decorative outside positioning mode (the separate drag
          // layer below handles repositioning) — without this, clicking the
          // visible photo would make event.target the <image> itself rather
          // than the SVG background, silently defeating the click-to-deselect
          // handler above for any click that happens to land on the photo.
          style={{ pointerEvents: 'none' }}
        />
      )}

      <GridLines widthFt={CANVAS_WIDTH_FT} heightFt={CANVAS_HEIGHT_FT} />

      {footprintItems.map((item) => {
        const { x, y } = getDisplayPosition(item, dragState)
        return (
          <PlacedModuleShape
            key={item.id}
            item={item}
            part={partsById[item.partId]}
            x={x}
            y={y}
            isSelected={item.id === selectedItemId}
            onPointerDown={(event) => handlePointerDown(event, item)}
          />
        )
      })}

      {seams.map((seam, index) => (
        <SeamLine key={index} seam={seam} />
      ))}

      {markerItems.map((item) => {
        const { x, y } = getDisplayPosition(item, dragState)
        return (
          <AccessoryMarker
            key={item.id}
            part={partsById[item.partId]}
            x={x}
            y={y}
            isSelected={item.id === selectedItemId}
            onPointerDown={(event) => handlePointerDown(event, item)}
          />
        )
      })}

      {isPositioningBackground && backgroundImage && (
        <rect
          x={0}
          y={0}
          width={CANVAS_WIDTH_FT * PIXELS_PER_FOOT}
          height={CANVAS_HEIGHT_FT * PIXELS_PER_FOOT}
          fill="transparent"
          className="background-drag-layer"
          onPointerDown={handleBackgroundPointerDown}
        />
      )}
    </svg>
  )
}
