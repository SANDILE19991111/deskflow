export const PRIORITIES = ['Low', 'Medium', 'High']
export const STATUSES = ['Open', 'In Progress', 'Resolved']

/**
 * Mirrors the backend's validators.js constraints so the user sees the
 * same rules client-side before ever hitting the network.
 */
export function validateTicketForm({ title, description, priority }) {
  const errors = {}

  const trimmedTitle = title.trim()
  if (!trimmedTitle) {
    errors.title = 'Title is required'
  } else if (trimmedTitle.length < 3 || trimmedTitle.length > 120) {
    errors.title = 'Title must be 3–120 characters'
  }

  const trimmedDescription = description.trim()
  if (!trimmedDescription) {
    errors.description = 'Description is required'
  } else if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
    errors.description = 'Description must be 10–2000 characters'
  }

  if (!priority) {
    errors.priority = 'Priority is required'
  } else if (!PRIORITIES.includes(priority)) {
    errors.priority = 'Priority must be Low, Medium, or High'
  }

  return errors
}
