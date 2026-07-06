import { PARTS } from '../../data/partsCatalog.js'

const MODULE_PARTS = PARTS.filter((part) => part.category === 'module')

export function ModulePalette({ onAddModule }) {
  return (
    <div className="module-palette">
      <h3>Modules</h3>
      <ul>
        {MODULE_PARTS.map((part) => (
          <li key={part.id}>
            <button type="button" onClick={() => onAddModule(part.id)}>
              {part.name.replace('PolyDock ', '')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
