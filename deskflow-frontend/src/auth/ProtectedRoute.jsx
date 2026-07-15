import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext.jsx'

/**
 * Wraps a route that requires authentication, and optionally a specific role.
 * - No user at all       -> bounce to /login
 * - Wrong role for route -> bounce to that user's own dashboard
 */
function ProtectedRoute({ allowedRole, children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    const home = user.role === 'Admin' ? '/admin' : '/employee'
    return <Navigate to={home} replace />
  }

  return children
}

export default ProtectedRoute
