import { useState } from 'react'
import { PARTS } from '../../data/partsCatalog.js'
import { CategoryTabs } from '../inventory/CategoryTabs.jsx'

// Only categories a user places directly on the canvas — connectors are
// auto-calculated by Stage 4's matching logic, never manually placed (see
// staging/stage-3-design-canvas/feature-grid-canvas.md).
const PLACEABLE_CATEGORIES = ['module', 'gangway', 'accessory']
const PLACEABLE_CATEGORY_LABELS = {
  module: 'Modules',
  gangway: 'Gangways',
  accessory: 'Accessories',
}

export function Palette({ onAddItem }) {
  const [activeCategory, setActiveCategory] = useState('module')
  const partsForCategory = PARTS.filter((part) => part.category === activeCategory)

  return (
    <div className="module-palette">
      <CategoryTabs
        categories={PLACEABLE_CATEGORIES}
        labels={PLACEABLE_CATEGORY_LABELS}
        active={activeCategory}
        onSelect={setActiveCategory}
      />
      {partsForCategory.length === 0 ? (
        <p className="palette-empty">Nothing in this category yet.</p>
      ) : (
        <ul>
          {partsForCategory.map((part) => (
            <li key={part.id}>
              <button type="button" onClick={() => onAddItem(part.id)}>
                {part.name.replace('PolyDock ', '')}
                {!part.isVerified && <span className="badge-unverified">unconfirmed</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
