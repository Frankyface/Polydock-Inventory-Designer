import { GANGWAY_ATTACHMENT_RULES } from '../../data/partsCatalog.js'

// Derives a design's full parts list from canvas state: every placed
// module/gangway/accessory counts once, plus the connector or gangway-hinge
// hardware implied by each seam computeSeams() detected. This is "the
// disconnect" fix — the BOM is never hand-entered, only computed from what's
// actually on the canvas (see docs/master_plan.md).
//
// Seams that need a connector/hinge but have no matching catalog part (an
// unmapped edge length, or a gangway/ramp missing from GANGWAY_ATTACHMENT_RULES)
// are NOT silently dropped — they're counted in unresolvedCount so the
// caller can block committing an incomplete parts list rather than under-order.
export function computeBom(footprintItems, markerItems, seams, partsById) {
  const itemById = new Map(footprintItems.map((item) => [item.id, item]))
  const quantityByPartId = new Map()
  const bump = (partId) => quantityByPartId.set(partId, (quantityByPartId.get(partId) ?? 0) + 1)

  footprintItems.forEach((item) => bump(item.partId))
  markerItems.forEach((item) => bump(item.partId))

  let unresolvedCount = 0
  seams.forEach((seam) => {
    if (seam.isGangwayAttachment) {
      const itemA = itemById.get(seam.moduleAId)
      const itemB = itemById.get(seam.moduleBId)
      const gangwayItem = [itemA, itemB].find((item) => partsById[item?.partId]?.category === 'gangway')
      const hardwarePartId = gangwayItem && GANGWAY_ATTACHMENT_RULES[gangwayItem.partId]
      if (hardwarePartId) {
        bump(hardwarePartId)
      } else {
        unresolvedCount += 1
      }
      return
    }
    if (seam.connectorPartId) {
      bump(seam.connectorPartId)
    } else {
      unresolvedCount += 1
    }
  })

  const lines = Array.from(quantityByPartId.entries())
    .map(([partId, quantity]) => ({ partId, part: partsById[partId], quantity }))
    .sort((a, b) => a.part.name.localeCompare(b.part.name))

  return { lines, unresolvedCount }
}
