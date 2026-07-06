import { PARTS } from '../../data/partsCatalog.js'

const SKU_HEADER_PATTERN = /^(sku|part\s*id|id)$/i
const QUANTITY_HEADER_PATTERN = /^(quantity|qty|on\s*hand|count|stock)$/i
const NAME_HEADER_PATTERN = /^(name|part\s*name|description)$/i

function normalizeForMatch(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function findHeader(headers, pattern) {
  return headers.find((header) => pattern.test(header))
}

function findPartBySku(skuValue) {
  const normalized = skuValue.trim().toLowerCase()
  return PARTS.find((part) => part.sku?.toLowerCase() === normalized || part.id.toLowerCase() === normalized)
}

function findPartByName(nameValue) {
  const normalized = normalizeForMatch(nameValue)
  const exact = PARTS.find((part) => normalizeForMatch(part.name) === normalized)
  if (exact) return exact

  // Fallback fuzzy match (mitigates the catalog's known SKU inconsistencies —
  // see feature-local-catalog-data.md): a normalized substring match either
  // direction. Only accepted if exactly one part qualifies — an ambiguous
  // match is never guessed, it's left unmatched with a reason instead.
  const candidates = PARTS.filter((part) => {
    const partNormalized = normalizeForMatch(part.name)
    return partNormalized.includes(normalized) || normalized.includes(partNormalized)
  })
  return candidates.length === 1 ? candidates[0] : undefined
}

// Given rows parsed by csvParser.js (array of header-keyed objects), matches
// each row to a catalog part in src/data/partsCatalog.js by SKU (or our own
// part id) first, falling back to an exact normalized name match. Rows that
// can't be matched or have an invalid quantity are returned separately with
// a reason — never silently dropped (see feature-csv-upload.md).
export function matchImportRows(rows) {
  if (rows.length === 0) return { matched: [], unmatched: [] }

  const headers = Object.keys(rows[0])
  const skuHeader = findHeader(headers, SKU_HEADER_PATTERN)
  const quantityHeader = findHeader(headers, QUANTITY_HEADER_PATTERN)
  const nameHeader = findHeader(headers, NAME_HEADER_PATTERN)

  if (!quantityHeader) {
    return {
      matched: [],
      unmatched: rows.map((row) => ({
        row,
        reason: 'No recognizable quantity column found (expected a header like "quantity", "qty", "on hand", "count", or "stock").',
      })),
    }
  }

  return rows.reduce(
    (acc, row) => {
      const skuValue = skuHeader ? row[skuHeader] : ''
      const nameValue = nameHeader ? row[nameHeader] : ''
      const quantityRaw = row[quantityHeader]
      const trimmedQuantity = (quantityRaw ?? '').trim()

      // Require a clean whole-number string — Number.parseInt alone would
      // silently truncate "12.5" to 12 or "12abc" to 12 instead of rejecting it.
      if (!/^\d+$/.test(trimmedQuantity)) {
        acc.unmatched.push({ row, reason: `Invalid quantity "${quantityRaw}" — must be a whole number ≥ 0.` })
        return acc
      }
      const quantity = Number.parseInt(trimmedQuantity, 10)

      const part = (skuValue && findPartBySku(skuValue)) || (nameValue && findPartByName(nameValue))

      if (!part) {
        const attempted = skuValue || nameValue
        acc.unmatched.push({
          row,
          reason: attempted ? `No catalog part matched "${attempted}".` : 'No SKU or name column value to match on.',
        })
        return acc
      }

      acc.matched.push({ part, quantity, row })
      return acc
    },
    { matched: [], unmatched: [] },
  )
}
