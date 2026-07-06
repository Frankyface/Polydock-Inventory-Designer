import { CONNECTOR_RULES } from '../../data/partsCatalog.js'
import { SNAP_TOLERANCE_FT } from './constants.js'

const EPSILON = 0.01

// Rotation is 90°-increment only. At 90/270 the module's two nominal edge
// lengths swap which axis they occupy; at 0/180 they don't.
export function getFootprint(part, rotation) {
  const [a, b] = part.dimensions.nominalEdgesFt
  return rotation % 180 === 90 ? { width: b, height: a } : { width: a, height: b }
}

export function getBounds(placedModule, part) {
  const { width, height } = getFootprint(part, placedModule.rotation)
  return {
    x0: placedModule.x,
    y0: placedModule.y,
    x1: placedModule.x + width,
    y1: placedModule.y + height,
  }
}

function overlapLength(a0, a1, b0, b1) {
  return Math.min(a1, b1) - Math.max(a0, b0)
}

// Picks whichever of the two candidate gaps is smaller in magnitude (nulls
// lose to any real candidate). Used to reduce computeSnappedPosition's 4
// near-identical branches (2 per axis) to one call each.
function closerGap(candidate, best) {
  if (candidate === null) return best
  if (best === null) return candidate
  return Math.abs(candidate) < Math.abs(best) ? candidate : best
}

// Given a module's tentative dropped position (as bounds) and the bounds of
// every OTHER placed module, finds the closest edge-to-edge alignment within
// SNAP_TOLERANCE_FT on each axis independently, and returns the snapped
// top-left position. No expansion gap is modeled — PolyDock modules are
// designed to sit flush (see feature-local-catalog-data.md) — so a snap
// always closes the gap to exactly zero.
//
// Known limitation: x and y snaps are chosen independently, so a module
// dragged into a corner formed by two DIFFERENT neighbors can snap flush to
// neither exactly (see staging/stage-3-design-canvas/feature-module-snapping.md).
export function computeSnappedPosition(draggedBounds, neighborBoundsList) {
  let bestDx = null
  let bestDy = null

  for (const neighbor of neighborBoundsList) {
    if (overlapLength(draggedBounds.y0, draggedBounds.y1, neighbor.y0, neighbor.y1) > EPSILON) {
      const rightToLeft = neighbor.x0 - draggedBounds.x1
      const leftToRight = -(draggedBounds.x0 - neighbor.x1)
      if (Math.abs(rightToLeft) <= SNAP_TOLERANCE_FT) bestDx = closerGap(rightToLeft, bestDx)
      if (Math.abs(leftToRight) <= SNAP_TOLERANCE_FT) bestDx = closerGap(leftToRight, bestDx)
    }
    if (overlapLength(draggedBounds.x0, draggedBounds.x1, neighbor.x0, neighbor.x1) > EPSILON) {
      const bottomToTop = neighbor.y0 - draggedBounds.y1
      const topToBottom = -(draggedBounds.y0 - neighbor.y1)
      if (Math.abs(bottomToTop) <= SNAP_TOLERANCE_FT) bestDy = closerGap(bottomToTop, bestDy)
      if (Math.abs(topToBottom) <= SNAP_TOLERANCE_FT) bestDy = closerGap(topToBottom, bestDy)
    }
  }

  return {
    x: draggedBounds.x0 + (bestDx ?? 0),
    y: draggedBounds.y0 + (bestDy ?? 0),
  }
}

function getTouchingSegment(a, b) {
  if (Math.abs(a.x1 - b.x0) < EPSILON) {
    const start = Math.max(a.y0, b.y0)
    const end = Math.min(a.y1, b.y1)
    if (end - start > EPSILON) return { orientation: 'vertical', start, end, edgeOfA: 'right', edgeOfB: 'left' }
  }
  if (Math.abs(b.x1 - a.x0) < EPSILON) {
    const start = Math.max(a.y0, b.y0)
    const end = Math.min(a.y1, b.y1)
    if (end - start > EPSILON) return { orientation: 'vertical', start, end, edgeOfA: 'left', edgeOfB: 'right' }
  }
  if (Math.abs(a.y1 - b.y0) < EPSILON) {
    const start = Math.max(a.x0, b.x0)
    const end = Math.min(a.x1, b.x1)
    if (end - start > EPSILON) return { orientation: 'horizontal', start, end, edgeOfA: 'bottom', edgeOfB: 'top' }
  }
  if (Math.abs(b.y1 - a.y0) < EPSILON) {
    const start = Math.max(a.x0, b.x0)
    const end = Math.min(a.x1, b.x1)
    if (end - start > EPSILON) return { orientation: 'horizontal', start, end, edgeOfA: 'top', edgeOfB: 'bottom' }
  }
  return null
}

const EDGE_LENGTH_GETTERS = {
  left: (bounds) => bounds.y1 - bounds.y0,
  right: (bounds) => bounds.y1 - bounds.y0,
  top: (bounds) => bounds.x1 - bounds.x0,
  bottom: (bounds) => bounds.x1 - bounds.x0,
}

const EDGE_LINE_GETTERS = {
  left: (bounds) => bounds.x0,
  right: (bounds) => bounds.x1,
  top: (bounds) => bounds.y0,
  bottom: (bounds) => bounds.y1,
}

function pointKey(x, y) {
  return `${Math.round(x / EPSILON)},${Math.round(y / EPSILON)}`
}

function connectorRuleFor(seamLengthFt, junctionType) {
  return CONNECTOR_RULES.find((rule) => rule.edgeLengthFt === seamLengthFt && rule.junctionType === junctionType)
}

// Computes every touching seam between placed modules and classifies each as
// a clean 2-module "straight" join (one connector spans the entire matching
// edge, and nothing else touches either side of it) or a "notched" junction
// (the edge is only partially covered by this neighbor, more than one
// neighbor touches the same edge, or 3+ modules' corners converge at a
// single point — a T/cross/platform situation). This is the canvas/geometry
// problem feature-module-snapping.md flags as needing to be solved at the
// canvas level, not deferred to Stage 4's BOM logic — Stage 4 consumes this
// output to pick the actual connector part and check stock.
export function computeSeams(placedModules, partsById) {
  const boundsById = new Map(placedModules.map((m) => [m.id, getBounds(m, partsById[m.partId])]))

  const contacts = []
  for (let i = 0; i < placedModules.length; i++) {
    for (let j = i + 1; j < placedModules.length; j++) {
      const segment = getTouchingSegment(boundsById.get(placedModules[i].id), boundsById.get(placedModules[j].id))
      if (segment) contacts.push({ moduleAId: placedModules[i].id, moduleBId: placedModules[j].id, ...segment })
    }
  }

  // More than one contact touching the same (module, edge) means that edge
  // meets multiple neighbors — never a clean 2-module straight join.
  const contactCountByModuleEdge = new Map()
  const bump = (moduleId, edge) => {
    const key = `${moduleId}:${edge}`
    contactCountByModuleEdge.set(key, (contactCountByModuleEdge.get(key) ?? 0) + 1)
  }
  contacts.forEach((contact) => {
    bump(contact.moduleAId, contact.edgeOfA)
    bump(contact.moduleBId, contact.edgeOfB)
  })

  const seams = contacts.map((contact) => {
    const boundsA = boundsById.get(contact.moduleAId)
    const boundsB = boundsById.get(contact.moduleBId)
    const edgeLengthA = EDGE_LENGTH_GETTERS[contact.edgeOfA](boundsA)
    const edgeLengthB = EDGE_LENGTH_GETTERS[contact.edgeOfB](boundsB)
    const contactLength = contact.end - contact.start
    const onlyContactOnA = contactCountByModuleEdge.get(`${contact.moduleAId}:${contact.edgeOfA}`) === 1
    const onlyContactOnB = contactCountByModuleEdge.get(`${contact.moduleBId}:${contact.edgeOfB}`) === 1

    const isStraight =
      onlyContactOnA &&
      onlyContactOnB &&
      Math.abs(contactLength - edgeLengthA) < EPSILON &&
      Math.abs(contactLength - edgeLengthB) < EPSILON

    const line = EDGE_LINE_GETTERS[contact.edgeOfA](boundsA)

    return {
      moduleAId: contact.moduleAId,
      moduleBId: contact.moduleBId,
      orientation: contact.orientation,
      line,
      start: contact.start,
      end: contact.end,
      lengthFt: contactLength,
      junctionType: isStraight ? 'straight' : 'notched',
    }
  })

  // A "straight" seam whose endpoint is shared with 2+ OTHER seams means 3+
  // modules' corners converge at that single point — a platform/cross join
  // per the manufacturer's rule (notched connectors "make larger platforms"),
  // even though each individual seam looks like a clean 2-module join on its
  // own. Upgrade every seam touching such a point to "notched".
  const seamCountByPoint = new Map()
  const seamEndpoints = (seam) =>
    seam.orientation === 'vertical'
      ? [pointKey(seam.line, seam.start), pointKey(seam.line, seam.end)]
      : [pointKey(seam.start, seam.line), pointKey(seam.end, seam.line)]

  seams.forEach((seam) => {
    seamEndpoints(seam).forEach((key) => {
      seamCountByPoint.set(key, (seamCountByPoint.get(key) ?? new Set()).add(seam))
    })
  })

  return seams.map((seam) => {
    const convergesAtCrossPoint = seamEndpoints(seam).some((key) => seamCountByPoint.get(key).size >= 3)
    const junctionType = convergesAtCrossPoint ? 'notched' : seam.junctionType

    const seamLengthFt = Math.round(seam.lengthFt)
    const isNearWholeFoot = Math.abs(seam.lengthFt - seamLengthFt) < EPSILON
    const connectorRule = isNearWholeFoot ? connectorRuleFor(seamLengthFt, junctionType) : undefined

    return { ...seam, junctionType, connectorPartId: connectorRule?.connectorPartId ?? null }
  })
}
