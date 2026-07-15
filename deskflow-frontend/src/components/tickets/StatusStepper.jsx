import { STATUSES } from '../../utils/validation.js'

const COLORS = {
  Open: 'bg-status-open border-status-open',
  'In Progress': 'bg-status-progress border-status-progress',
  Resolved: 'bg-status-resolved border-status-resolved',
}

/**
 * Renders ticket status as a position along Open -> In Progress -> Resolved,
 * since status is genuinely a workflow stage, not an independent label.
 * Steps up to and including the current one are filled; later ones are hollow.
 */
function StatusStepper({ status }) {
  const currentIndex = STATUSES.indexOf(status)

  return (
    <div className="flex items-center gap-1.5" role="img" aria-label={`Status: ${status}`}>
      {STATUSES.map((step, i) => {
        const isReached = i <= currentIndex
        const isCurrent = i === currentIndex
        return (
          <div key={step} className="flex items-center gap-1.5">
            <span
              className={[
                'h-2 w-2 rounded-full border transition-colors',
                isReached ? COLORS[step] : 'border-line bg-transparent',
                isCurrent ? 'ring-2 ring-offset-1' : '',
              ].join(' ')}
              style={isCurrent ? { '--tw-ring-color': 'currentColor' } : undefined}
            />
            {i < STATUSES.length - 1 && (
              <span className={`h-px w-4 ${isReached && i < currentIndex ? 'bg-ink/30' : 'bg-line'}`} />
            )}
          </div>
        )
      })}
      <span className="ml-1.5 text-xs font-medium text-ink/80">{status}</span>
    </div>
  )
}

export default StatusStepper
