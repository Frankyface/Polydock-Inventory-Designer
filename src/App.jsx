import { useLocalInventory } from './features/inventory/useLocalInventory.js'
import { CatalogInventoryView } from './features/inventory/CatalogInventoryView.jsx'
import { CsvImportPanel } from './features/inventory/CsvImportPanel.jsx'

export default function App() {
  const { parts, setQuantity, applyBulkQuantities } = useLocalInventory()

  return (
    <>
      <header className="app-header">
        <h1>PolyDock Inventory</h1>
      </header>
      <CsvImportPanel onApply={applyBulkQuantities} />
      <CatalogInventoryView parts={parts} setQuantity={setQuantity} />
    </>
  )
}
