import { useMemo, useRef, useState } from 'react'
import { CANVAS_WIDTH_FT, CANVAS_HEIGHT_FT, PIXELS_PER_FOOT } from './constants.js'
import { getFootprint, getBounds, computeSnappedPosition, computeSeams } from './geometry.js'
import { GridLines } from './GridLines.jsx'
import { PlacedModuleShape } from './PlacedModuleShape.jsx'
import { SeamLine } from './SeamLine.jsx'

export function DesignCanvas({ items, partsById, selectedItemId, onSelect, onUpdateItem }) {
  const svgRef = useRef(null)
  // { itemId, offsetX, offsetY (pointer-to-item-origin offset, in ft),
  //   currentX, currentY, hasMoved }
  const [dragState, setDragState] = useState(null)

  // Defends against a design whose saved items reference a partId that no
  // longer exists in the catalog (e.g. after a future catalog change) —
  // skips just that item instead of crashing the whole canvas.
  const validItems = items.filter((item) => partsById[item.partId])

  function toFeet(clientX, clientY) {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: (clientX - rect.left) / PIXELS_PER_FOOT, y: (clientY - rect.top) / PIXELS_PER_FOOT }
  }

  function handlePointerDown(event, item) {
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
    if (!dragState) return
    // A plain click (pointerdown immediately followed by pointerup, no real
    // movement) already selected the item in handlePointerDown — leave its
    // position untouched rather than re-running the snap logic for nothing.
    if (!dragState.hasMoved) {
      setDragState(null)
      return
    }
    const item = validItems.find((candidate) => candidate.id === dragState.itemId)
    if (!item) {
      setDragState(null)
      return
    }
    const part = partsById[item.partId]
    const { width, height } = getFootprint(part, item.rotation)
    const draggedBounds = {
      x0: dragState.currentX,
      y0: dragState.currentY,
      x1: dragState.currentX + width,
      y1: dragState.currentY + height,
    }
    const neighborBounds = validItems
      .filter((candidate) => candidate.id !== item.id)
      .map((candidate) => getBounds(candidate, partsById[candidate.partId]))
    const snapped = computeSnappedPosition(draggedBounds, neighborBounds)
    onUpdateItem(item.id, { x: Math.max(0, snapped.x), y: Math.max(0, snapped.y) })
    setDragState(null)
  }

  const seams = useMemo(() => computeSeams(validItems, partsById), [validItems, partsById])

  return (
    <svg
      ref={svgRef}
      width={CANVAS_WIDTH_FT * PIXELS_PER_FOOT}
      height={CANVAS_HEIGHT_FT * PIXELS_PER_FOOT}
      className="design-canvas"
      onClick={() => onSelect(null)}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <GridLines widthFt={CANVAS_WIDTH_FT} heightFt={CANVAS_HEIGHT_FT} />

      {validItems.map((item) => {
        const isDragging = dragState?.itemId === item.id
        const x = isDragging ? dragState.currentX : item.x
        const y = isDragging ? dragState.currentY : item.y
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
    </svg>
  )
}
