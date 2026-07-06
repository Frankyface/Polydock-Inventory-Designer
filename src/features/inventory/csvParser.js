// Minimal RFC4180-ish CSV parser: handles quoted fields (with embedded
// commas/newlines/escaped quotes) since spreadsheet exports commonly quote
// fields. No external dependency needed for something this small.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  function pushField() {
    row.push(field)
    field = ''
  }
  function pushRow() {
    pushField()
    rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
    } else if (char === '"' && field === '') {
      // A quote only opens a quoted field at the field's start (RFC4180).
      // A stray quote mid-field is treated as a literal character instead —
      // otherwise one unescaped quote anywhere in the file would flip
      // inQuotes on permanently and swallow the rest of the file into one field.
      inQuotes = true
    } else if (char === ',') {
      pushField()
    } else if (char === '\r') {
      // ignore — paired \n (if present) triggers the row push
    } else if (char === '\n') {
      pushRow()
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) pushRow()

  if (rows.length === 0) return []
  const headers = rows[0].map((h) => h.trim())
  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell.trim() !== ''))
    .map((r) => Object.fromEntries(headers.map((h, index) => [h, (r[index] ?? '').trim()])))
}
