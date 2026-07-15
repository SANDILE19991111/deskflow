import { STATUSES } from '../../utils/validation.js'

function StatusSelect({ value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Update ticket status"
      className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-sm font-medium text-ink
                 focus:border-indigo focus:outline-none disabled:opacity-50"
    >
      {STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  )
}

export default StatusSelect
