// Presentational only — all BOM/stock-check computation happens in
// DesignEditor.jsx (bom.js + inventory lookup), this just renders the result
// and forwards the two user actions (commit/release).
export function BomPanel({
  lines,
  unresolvedCount,
  isFreeDesign,
  isCommitted,
  canCommit,
  canRelease,
  commitBlockedReason,
  onCommit,
  onRelease,
}) {
  return (
    <div className="bom-panel">
      <div className="app-header">
        <h3>Bill of Materials</h3>
        {isCommitted ? (
          <button type="button" onClick={onRelease} disabled={!canRelease}>
            Release from inventory
          </button>
        ) : (
          !isFreeDesign && (
            <button type="button" onClick={onCommit} disabled={!canCommit}>
              Commit to inventory
            </button>
          )
        )}
      </div>

      {isCommitted && (
        <p className="bom-status-committed">Committed — these parts have been deducted from inventory.</p>
      )}
      {isFreeDesign && (
        <p className="bom-hint">Free design — parts list shown for reference only, stock isn't checked.</p>
      )}
      {unresolvedCount > 0 && (
        <p className="error-text">
          {unresolvedCount} seam{unresolvedCount === 1 ? '' : 's'} need{unresolvedCount === 1 ? 's' : ''} a
          connector or hinge part not in the catalog — resolve before committing.
        </p>
      )}
      {commitBlockedReason && <p className="error-text">{commitBlockedReason}</p>}

      {lines.length === 0 ? (
        <p>Nothing placed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Part</th>
              <th>Qty needed</th>
              {!isFreeDesign && <th>On hand</th>}
              {!isFreeDesign && <th>Status</th>}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.partId}>
                <td>
                  {line.part.name.replace('PolyDock ', '')}
                  {!line.part.isVerified && <span className="badge-unverified">unconfirmed</span>}
                </td>
                <td>{line.quantity}</td>
                {!isFreeDesign && <td>{line.quantityOnHand}</td>}
                {!isFreeDesign && (
                  <td className={line.shortfall > 0 ? 'error-text' : ''}>
                    {line.shortfall > 0 ? `Short by ${line.shortfall}` : 'OK'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
