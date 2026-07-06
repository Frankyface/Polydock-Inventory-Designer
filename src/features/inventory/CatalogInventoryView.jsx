import { useState } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '../../data/partsCatalog.js'
import { CategoryTabs } from './CategoryTabs.jsx'
import { PartRow } from './PartRow.jsx'

export function CatalogInventoryView({ parts, setQuantity }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0])

  const visibleParts = parts.filter((part) => part.category === activeCategory)

  return (
    <div>
      <CategoryTabs
        categories={CATEGORIES}
        labels={CATEGORY_LABELS}
        active={activeCategory}
        onSelect={setActiveCategory}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>On hand</th>
          </tr>
        </thead>
        <tbody>
          {visibleParts.map((part) => (
            <PartRow key={part.id} part={part} onQuantityChange={setQuantity} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
