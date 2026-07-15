import { useState } from 'react'
import AppShell from '../components/layout/AppShell.jsx'
import TicketForm from '../components/tickets/TicketForm.jsx'
import EmployeeTicketList from '../components/tickets/EmployeeTicketList.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import { initialMockTickets } from '../data/mockTickets.js'

function EmployeeDashboardPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState(() =>
    initialMockTickets.filter((t) => t.createdBy.email === user.email),
  )
  const [submitting, setSubmitting] = useState(false)

  // TODO (Day 4): replace with `await api.post('/api/tickets', form)`
  // and set tickets from the response instead of building locally.
  function handleCreateTicket(form) {
    setSubmitting(true)
    const newTicket = {
      _id: `mock-${crypto.randomUUID()}`,
      ...form,
      status: 'Open',
      createdBy: { name: user.name, email: user.email },
      createdAt: new Date().toISOString(),
    }
    setTickets((prev) => [newTicket, ...prev])
    setSubmitting(false)
  }

  return (
    <AppShell>
      <h1 className="font-display text-xl font-semibold text-ink">Welcome back, {user.name.split(' ')[0]}</h1>
      <p className="mt-1 text-sm text-ink/60">Report an issue or check the status of your open requests.</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        <TicketForm onSubmit={handleCreateTicket} submitting={submitting} />

        <div>
          <h2 className="mb-3 font-display text-sm font-semibold text-ink">Your requests</h2>
          <EmployeeTicketList tickets={tickets} />
        </div>
      </div>
    </AppShell>
  )
}

export default EmployeeDashboardPage
