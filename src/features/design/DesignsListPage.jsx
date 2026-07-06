export function DesignsListPage({ designs, onCreate, onSelect, onDelete, saveError }) {
  function handleDelete(design) {
    // Deleting a committed design does NOT restock its parts — the BOM was
    // deducted to reflect a real build, so it stays consumed. Warn loudly
    // here since that's not obvious from the row alone (see
    // staging/stage-4-stock-aware-bom/feature-commit-inventory.md).
    const message = design.isCommitted
      ? `"${design.name}" is committed — deleting it will NOT return its parts to inventory. Delete anyway?`
      : `Delete "${design.name}"?`
    if (window.confirm(message)) onDelete(design.id)
  }

  return (
    <div className="designs-list-page">
      <div className="app-header">
        <h2>Designs</h2>
        <button type="button" onClick={onCreate}>
          + New design
        </button>
      </div>
      {saveError && (
        <p className="error-text">
          Your last change couldn't be saved to this browser's storage (it may be full). Try freeing up space or
          removing a background image from a design.
        </p>
      )}
      {designs.length === 0 ? (
        <p>No designs yet — create one to start laying out a dock.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Modules</th>
              <th>Free design</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {designs.map((design) => (
              <tr key={design.id}>
                <td>
                  <button type="button" className="link-button" onClick={() => onSelect(design.id)}>
                    {design.name}
                  </button>
                </td>
                <td>{design.items.length}</td>
                <td>{design.isFreeDesign ? 'Yes' : 'No'}</td>
                <td>{design.isCommitted ? 'Committed' : '—'}</td>
                <td>{new Date(design.updatedAt).toLocaleString()}</td>
                <td>
                  <button type="button" onClick={() => handleDelete(design)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
