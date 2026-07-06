import { memo } from 'react'
import { PIXELS_PER_FOOT } from './constants.js'

// widthFt/heightFt are always the fixed canvas constants in practice, so this
// never needs to re-render once mounted — memoized since DesignCanvas
// re-renders on every pointermove during a drag.
export const GridLines = memo(function GridLines({ widthFt, heightFt }) {
  const verticalLines = Array.from({ length: widthFt + 1 }, (_, i) => i)
  const horizontalLines = Array.from({ length: heightFt + 1 }, (_, i) => i)

  return (
    <g className="grid-lines">
      {verticalLines.map((i) => (
        <line
          key={`v${i}`}
          x1={i * PIXELS_PER_FOOT}
          y1={0}
          x2={i * PIXELS_PER_FOOT}
          y2={heightFt * PIXELS_PER_FOOT}
          stroke="#e3e8ec"
        />
      ))}
      {horizontalLines.map((i) => (
        <line
          key={`h${i}`}
          x1={0}
          y1={i * PIXELS_PER_FOOT}
          x2={widthFt * PIXELS_PER_FOOT}
          y2={i * PIXELS_PER_FOOT}
          stroke="#e3e8ec"
        />
      ))}
    </g>
  )
})
