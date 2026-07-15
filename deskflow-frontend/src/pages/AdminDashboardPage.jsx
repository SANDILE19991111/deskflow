import { useMemo, useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import AdminTicketFeed from '../components/tickets/AdminTicketFeed.jsx'
import { STATUSES } from '../utils/validation.js'
import { initialMockTickets } from '../data/mockTickets.js'

const FILTERS = ['All', ...STATUSES]

function AdminDashboardPage() {
  const [tickets, setTickets] = useState(initialMockTickets)
  const [filter, setFilter] = useState('All')
  const [updatingId, setUpdatingId] = useState(null)

  const visibleTickets = useMemo(
    () => (filter === 'All' ? tickets : tickets.filter((t) => t.status === filter)),
    [tickets, filter],
  )

  // TODO (Day 4): replace with `await api.put(`/api/tickets/${id}`, { status })`
  // and reconcile local state from the response.
  function handleStatusChange(id, status) {
    setUpdatingId(id)
    setTickets((prev) => prev.map((t) => (t._id === id ? { ...t, status } : t)))
    setUpdatingId(null)
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">All tickets</h1>
          <p className="mt-1 text-sm text-ink/60">{tickets.length} requests across the organization</p>
        </div>
      </div>

      <div className="mt-5 flex gap-1.5">
        {FILTERS.map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            className={[
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              filter === option
                ? 'border-indigo bg-indigo-dim text-indigo'
                : 'border-line text-ink/60 hover:border-ink/30',
            ].join(' ')}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <AdminTicketFeed tickets={visibleTickets} onStatusChange={handleStatusChange} updatingId={updatingId} />
      </div>
    </AppShell>
  )
}

export default AdminDashboardPage
