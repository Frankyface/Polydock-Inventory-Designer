import { useRef, useState } from 'react'
import { parseCsv } from './csvParser.js'
import { matchImportRows } from './matchImportRows.js'

export function CsvImportPanel({ onApply }) {
  const [open, setOpen] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [result, setResult] = useState(null)
  const [parseError, setParseError] = useState(null)
  const [applied, setApplied] = useState(false)

  // Guards against a second file being selected before the first one's async
  // read/parse finishes — without this, whichever resolves last would win
  // regardless of which file was actually picked last.
  const requestIdRef = useRef(0)

  async function handleFile(event) {
    const file = event.target.files[0]
    if (!file) return
    const requestId = ++requestIdRef.current
    setFileName(file.name)
    setApplied(false)
    setParseError(null)
    setResult(null)

    let text
    try {
      text = await file.text()
    } catch {
      if (requestId === requestIdRef.current) setParseError('Could not read that file.')
      return
    }
    if (requestId !== requestIdRef.current) return // a newer file was selected meanwhile

    const rows = parseCsv(text)
    if (rows.length === 0) {
      setParseError('The file has no data rows.')
      return
    }
    setResult(matchImportRows(rows))
  }

  function handleApply() {
    if (!result || result.matched.length === 0) return
    onApply(result.matched.map(({ part, quantity }) => ({ partId: part.id, quantity })))
    setApplied(true)
  }

  return (
    <div className="csv-import-panel">
      <button type="button" onClick={() => setOpen((current) => !current)}>
        {open ? 'Hide CSV import' : 'Import CSV'}
      </button>
      {open && (
        <div className="csv-import-body">
          <p>
            Upload a CSV with a <code>sku</code> (or <code>name</code>) column and a{' '}
            <code>quantity</code> column. Matched rows set that part's on-hand count directly —
            unmatched rows are listed below, never silently skipped.
          </p>
          <input type="file" accept=".csv,text/csv" onChange={handleFile} />
          {fileName && <p>File: {fileName}</p>}
          {parseError && <p className="error-text">{parseError}</p>}

          {result && (
            <>
              <h3>
                Will update {result.matched.length} part{result.matched.length === 1 ? '' : 's'}
              </h3>
              {result.matched.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>New quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.matched.map(({ part, quantity }) => (
                      <tr key={part.id}>
                        <td>{part.name}</td>
                        <td>{part.sku ?? '—'}</td>
                        <td>{quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {result.unmatched.length > 0 && (
                <>
                  <h3>
                    {result.unmatched.length} row{result.unmatched.length === 1 ? '' : 's'} couldn't be imported
                  </h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Row data</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.unmatched.map(({ row, reason }, index) => {
                        const rowJson = JSON.stringify(row)
                        return (
                          <tr key={`${index}-${rowJson}-${reason}`}>
                            <td>{rowJson}</td>
                            <td className="error-text">{reason}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </>
              )}

              <button type="button" onClick={handleApply} disabled={result.matched.length === 0 || applied}>
                {applied ? 'Applied' : `Apply import (${result.matched.length})`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
