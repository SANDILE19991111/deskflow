import TicketCard from './TicketCard.jsx'

function EmployeeTicketList({ tickets }) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line px-6 py-10 text-center">
        <p className="font-display text-sm font-semibold text-ink">No requests yet</p>
        <p className="mt-1 text-sm text-ink/60">Submit a ticket using the form to report an issue.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </ul>
  )
}

export default EmployeeTicketList
