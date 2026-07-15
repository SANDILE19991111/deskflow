import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, DEMO_ACCOUNTS } from '../auth/AuthContext.jsx'

function LoginPage() {
  const [role, setRole] = useState('Employee')
  const [email, setEmail] = useState(DEMO_ACCOUNTS.Employee.email)
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleRoleToggle(nextRole) {
    setRole(nextRole)
    setEmail(DEMO_ACCOUNTS[nextRole].email)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const user = await login(role)
      navigate(user.role === 'Admin' ? '/admin' : '/employee')
    } catch (err) {
      setError('Login failed. Please check the demo credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-ink">DeskFlow</h1>
          <p className="mt-1 text-sm text-ink/60">Internal IT service request portal</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-surface p-6">
          <div className="flex rounded-md border border-line p-1">
            {['Employee', 'Admin'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleRoleToggle(option)}
                className={[
                  'flex-1 rounded-sm py-1.5 text-sm font-medium transition-colors',
                  role === option ? 'bg-indigo text-white' : 'text-ink/60 hover:text-ink',
                ].join(' ')}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label htmlFor="email" className="text-xs font-medium text-ink/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink
                         focus:border-indigo focus:outline-none"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="text-xs font-medium text-ink/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink
                         focus:border-indigo focus:outline-none"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-md border border-priority-high/30 bg-priority-high/10 px-3 py-2 text-xs text-priority-high">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-md bg-indigo px-4 py-2 text-sm font-semibold text-white
                       transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : `Sign in as ${role}`}
          </button>

          <p className="mt-4 text-center text-xs text-ink/40">
            Demo credentials are pre-filled. Toggle above to switch roles.
          </p>
        </form>
      </div>
    </div>
  )
}

export default LoginPage