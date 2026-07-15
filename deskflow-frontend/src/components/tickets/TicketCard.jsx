import PriorityTag from './PriorityTag.jsx'
import StatusStepper from './StatusStepper.jsx'
import { formatDate } from '../../utils/formatDate.js'

function TicketCard({ ticket }) {
  return (
    <li className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] text-ink/40">
            #{ticket._id.slice(-6)} · {formatDate(ticket.createdAt)}
          </p>
          <h3 className="mt-0.5 truncate font-display text-sm font-semibold text-ink">{ticket.title}</h3>
        </div>
        <PriorityTag priority={ticket.priority} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{ticket.description}</p>
      <div className="mt-3">
        <StatusStepper status={ticket.status} />
      </div>
    </li>
  )
}

export default TicketCard
