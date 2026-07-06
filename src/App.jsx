import { useState } from 'react'
import { useLocalInventory } from './features/inventory/useLocalInventory.js'
import { CatalogInventoryView } from './features/inventory/CatalogInventoryView.jsx'
import { CsvImportPanel } from './features/inventory/CsvImportPanel.jsx'
import { DesignsPage } from './features/design/DesignsPage.jsx'

const PAGES = ['Inventory', 'Designs']

export default function App() {
  const { parts, setQuantity, applyBulkQuantities } = useLocalInventory()
  const [activePage, setActivePage] = useState(PAGES[0])

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
              onClick={() => setActivePage(page)}
            >
              {page}
            </button>
          ))}
        </nav>
      </header>
      {activePage === 'Inventory' && (
        <>
          <CsvImportPanel onApply={applyBulkQuantities} />
          <CatalogInventoryView parts={parts} setQuantity={setQuantity} />
        </>
      )}
      {activePage === 'Designs' && <DesignsPage />}
    </>
  )
}
