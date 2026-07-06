import { PIXELS_PER_FOOT } from './constants.js'
import { getFootprint } from './geometry.js'

export function PlacedModuleShape({ item, part, x, y, isSelected, onPointerDown }) {
  const { width, height } = getFootprint(part, item.rotation)
  const label = part.name.replace('PolyDock ', '').replace(' Section', '')

  return (
    <g
      transform={`translate(${x * PIXELS_PER_FOOT}, ${y * PIXELS_PER_FOOT})`}
      onPointerDown={onPointerDown}
      className="placed-module"
    >
      <rect
        width={width * PIXELS_PER_FOOT}
        height={height * PIXELS_PER_FOOT}
        fill={isSelected ? '#bcd7f5' : '#dbe7f0'}
        stroke={isSelected ? '#2b6cb0' : '#7a93a6'}
        strokeWidth={isSelected ? 2 : 1}
        rx={2}
      />
      <text x={6} y={16} fontSize={11} fill="#1a2733">
        {label}
      </text>
    </g>
  )
}
