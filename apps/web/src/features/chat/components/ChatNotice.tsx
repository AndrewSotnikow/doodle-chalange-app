import { Button } from '../../../components/Button'

interface ChatNoticeProps {
  tone?: 'default' | 'error'
  title: string
  description?: string
  role?: 'alert' | 'status'
  actionLabel?: string
  onAction?: () => void
}

export function ChatNotice({
  actionLabel,
  description,
  onAction,
  role = 'status',
  title,
  tone = 'default'
}: ChatNoticeProps) {
  return (
    <div
      className={`message-list__state${tone === 'error' ? ' message-list__state--error' : ''}`}
      role={role}
    >
      <div>
        <p className="message-list__state-title">{title}</p>
        {description ? <p className="message-list__state-copy">{description}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <Button variant="inline" onClick={onAction} type="button">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
