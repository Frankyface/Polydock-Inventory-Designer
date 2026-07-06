import { useEffect, useRef, useState } from 'react'

export function PartRow({ part, onQuantityChange }) {
  const [draftQuantity, setDraftQuantity] = useState(String(part.quantityOnHand))
  const [invalid, setInvalid] = useState(false)
  const lastCommitted = useRef(part.quantityOnHand)

  // Resync when quantityOnHand changes from outside this row (e.g. another
  // browser tab writing to the same localStorage), without clobbering the
  // value this row itself just committed.
  useEffect(() => {
    if (part.quantityOnHand !== lastCommitted.current) {
      setDraftQuantity(String(part.quantityOnHand))
      lastCommitted.current = part.quantityOnHand
    }
  }, [part.quantityOnHand])

  function commit() {
    const parsed = Number.parseInt(draftQuantity, 10)
    if (Number.isNaN(parsed) || parsed < 0) {
      setDraftQuantity(String(part.quantityOnHand))
      setInvalid(true)
      return
    }
    setInvalid(false)
    lastCommitted.current = parsed
    if (parsed !== part.quantityOnHand) onQuantityChange(part.id, parsed)
  }

  return (
    <tr>
      <td>
        {part.name}
        {!part.isVerified && <span className="badge-unverified">unconfirmed</span>}
      </td>
      <td>{part.sku ?? '—'}</td>
      <td>
        <input
          type="number"
          min="0"
          value={draftQuantity}
          onChange={(e) => {
            setInvalid(false)
            setDraftQuantity(e.target.value)
          }}
          onBlur={commit}
          className={invalid ? 'input-invalid' : undefined}
          style={{ width: '5rem' }}
        />
        {invalid && <span className="error-text"> enter a number ≥ 0</span>}
      </td>
    </tr>
  )
}
