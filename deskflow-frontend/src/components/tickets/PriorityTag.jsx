const STYLES = {
  Low: 'text-priority-low',
  Medium: 'text-priority-medium',
  High: 'text-priority-high',
}

function PriorityTag({ priority }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${STYLES[priority] ?? 'text-ink'}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {priority}
    </span>
  )
}

export default PriorityTag
