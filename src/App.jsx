import { useCallback, useState } from 'react'
import { useLocalInventory } from './features/inventory/useLocalInventory.js'
import { CatalogInventoryView } from './features/inventory/CatalogInventoryView.jsx'
import { CsvImportPanel } from './features/inventory/CsvImportPanel.jsx'
import { DesignsPage } from './features/design/DesignsPage.jsx'

const PAGES = ['Inventory', 'Designs']

export default function App() {
  const { parts, setQuantity, applyBulkQuantities, applyBulkDeltas, saveError: inventorySaveError } = useLocalInventory()
  const [activePage, setActivePage] = useState(PAGES[0])
  // Lets DesignsPage/DesignEditor report unsaved changes, so switching the
  // top-level tab away from Designs doesn't silently discard them — the
  // in-editor "← Back" button isn't the only way to navigate away.
  const [isDesignsDirty, setIsDesignsDirty] = useState(false)
  const handleDesignsDirtyChange = useCallback((dirty) => setIsDesignsDirty(dirty), [])

  function handlePageChange(page) {
    if (activePage === 'Designs' && page !== 'Designs' && isDesignsDirty) {
      if (!window.confirm('Discard unsaved changes to this design?')) return
    }
    setActivePage(page)
  }

  return (
    <>
      <header className="app-header">
        <h1>PolyDock</h1>
        <nav className="page-nav">
          {PAGES.map((page) => (
            <button
              key={page}
              type="button"
              className={page === activePage ? 'tab tab-active' : 'tab'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </nav>
      </header>
      {inventorySaveError && (
        <p className="error-text">
          Inventory couldn't be saved to this browser's storage (it may be full) — the last change may not have
          persisted.
        </p>
      )}
      {activePage === 'Inventory' && (
        <>
          <CsvImportPanel onApply={applyBulkQuantities} />
          <CatalogInventoryView parts={parts} setQuantity={setQuantity} />
        </>
      )}
      {activePage === 'Designs' && (
        <DesignsPage onDirtyChange={handleDesignsDirtyChange} inventoryParts={parts} applyBulkDeltas={applyBulkDeltas} />
      )}
    </>
  )
}
