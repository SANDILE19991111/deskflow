import AdminTicketRow from './AdminTicketRow.jsx'

function AdminTicketFeed({ tickets, onStatusChange, updatingId }) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
        <p className="font-display text-sm font-semibold text-ink">No tickets in the system</p>
        <p className="mt-1 text-sm text-ink/60">Requests submitted by employees will appear here.</p>
      </div>
    )
  }

  return (
    <ul className="rounded-lg border border-line bg-surface">
      {tickets.map((ticket) => (
        <AdminTicketRow
          key={ticket._id}
          ticket={ticket}
          onStatusChange={onStatusChange}
          updating={updatingId === ticket._id}
        />
      ))}
    </ul>
  )
}

export default AdminTicketFeed
