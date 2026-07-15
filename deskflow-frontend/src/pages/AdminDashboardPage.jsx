import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import AdminTicketFeed from '../components/tickets/AdminTicketFeed.jsx'
import { STATUSES } from '../utils/validation.js'
import api from '../api/client.js'

const FILTERS = ['All', ...STATUSES]

function AdminDashboardPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState(null)

  async function fetchTickets() {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/api/tickets')
      setTickets(data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const visibleTickets = useMemo(
    () => (filter === 'All' ? tickets : tickets.filter((t) => t.status === filter)),
    [tickets, filter],
  )

  async function handleStatusChange(id, status) {
    setUpdatingId(id)
    setError(null)
    try {
      const { data } = await api.put(`/api/tickets/${id}`, { status })
      setTickets((prev) => prev.map((t) => (t._id === id ? { ...t, status: data.data.status } : t)))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket status.')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">All tickets</h1>
          <p className="mt-1 text-sm text-ink/60">{tickets.length} requests across the organization</p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-priority-high/30 bg-priority-high/10 px-3 py-2 text-sm text-priority-high">
          {error}
        </div>
      )}

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
        {loading ? (
          <p className="text-sm text-ink/60">Loading tickets…</p>
        ) : (
          <AdminTicketFeed tickets={visibleTickets} onStatusChange={handleStatusChange} updatingId={updatingId} />
        )}
      </div>
    </AppShell>
  )
}

export default AdminDashboardPage