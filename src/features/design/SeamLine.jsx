import { PIXELS_PER_FOOT } from './constants.js'

const SEAM_COLORS = {
  straight: '#2b6cb0',
  notched: '#c2410c',
}
const GANGWAY_ATTACHMENT_COLOR = '#7e5bef'

export function SeamLine({ seam }) {
  const color = seam.isGangwayAttachment ? GANGWAY_ATTACHMENT_COLOR : SEAM_COLORS[seam.junctionType]
  const x1 = seam.orientation === 'vertical' ? seam.line : seam.start
  const y1 = seam.orientation === 'vertical' ? seam.start : seam.line
  const x2 = seam.orientation === 'vertical' ? seam.line : seam.end
  const y2 = seam.orientation === 'vertical' ? seam.end : seam.line

  return (
    <line
      x1={x1 * PIXELS_PER_FOOT}
      y1={y1 * PIXELS_PER_FOOT}
      x2={x2 * PIXELS_PER_FOOT}
      y2={y2 * PIXELS_PER_FOOT}
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeDasharray={seam.isGangwayAttachment ? '2 4' : undefined}
    />
  )
}
