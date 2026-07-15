import PriorityTag from './PriorityTag.jsx'
import StatusStepper from './StatusStepper.jsx'
import StatusSelect from './StatusSelect.jsx'
import { formatDate } from '../../utils/formatDate.js'

function AdminTicketRow({ ticket, onStatusChange, updating }) {
  return (
    <li className="grid grid-cols-1 gap-3 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
      <div className="min-w-0">
        <p className="font-mono text-[11px] text-ink/40">
          #{ticket._id.slice(-6)} · {ticket.createdBy?.name ?? 'Unknown'} · {formatDate(ticket.createdAt)}
        </p>
        <h3 className="mt-0.5 truncate font-display text-sm font-semibold text-ink">{ticket.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-ink/60">{ticket.description}</p>
        <div className="mt-2 flex items-center gap-3">
          <PriorityTag priority={ticket.priority} />
          <StatusStepper status={ticket.status} />
        </div>
      </div>
      <StatusSelect
        value={ticket.status}
        disabled={updating}
        onChange={(newStatus) => onStatusChange(ticket._id, newStatus)}
      />
    </li>
  )
}

export default AdminTicketRow
