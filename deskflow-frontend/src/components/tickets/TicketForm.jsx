import { useState } from 'react'
import { PRIORITIES, validateTicketForm } from '../../utils/validation.js'

const EMPTY_FORM = { title: '', description: '', priority: '' }

function TicketForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validateTicketForm({ ...form }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateTicketForm(form)
    setErrors(validationErrors)
    setTouched({ title: true, description: true, priority: true })

    if (Object.keys(validationErrors).length > 0) return

    onSubmit(form)
    setForm(EMPTY_FORM)
    setTouched({})
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-lg border border-line bg-surface p-5">
      <h2 className="font-display text-sm font-semibold text-ink">Report an issue</h2>

      <div className="mt-4">
        <label htmlFor="title" className="text-xs font-medium text-ink/70">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="e.g. Laptop won't power on"
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm text-ink
                     focus:border-indigo focus:outline-none"
        />
        {touched.title && errors.title && (
          <p className="mt-1 text-xs text-priority-high">{errors.title}</p>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="text-xs font-medium text-ink/70">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="What happened, and what have you already tried?"
          className="mt-1 w-full resize-none rounded-md border border-line px-3 py-2 text-sm text-ink
                     focus:border-indigo focus:outline-none"
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-xs text-priority-high">{errors.description}</p>
        )}
      </div>

      <div className="mt-4">
        <span className="text-xs font-medium text-ink/70">Priority</span>
        <div className="mt-1.5 flex gap-2">
          {PRIORITIES.map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => handleChange('priority', priority)}
              className={[
                'flex-1 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                form.priority === priority
                  ? 'border-indigo bg-indigo-dim text-indigo'
                  : 'border-line text-ink/70 hover:border-ink/30',
              ].join(' ')}
            >
              {priority}
            </button>
          ))}
        </div>
        {touched.priority && errors.priority && (
          <p className="mt-1 text-xs text-priority-high">{errors.priority}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 w-full rounded-md bg-indigo px-4 py-2 text-sm font-semibold text-white
                   transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Submit request'}
      </button>
    </form>
  )
}

export default TicketForm
