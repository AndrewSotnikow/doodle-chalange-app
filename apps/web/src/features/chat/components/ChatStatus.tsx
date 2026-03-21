interface ChatStatusProps {
  activeAuthor: string
  hasError: boolean
  isLoading: boolean
  isSubmitting: boolean
  messageCount: number
}

function getStatusLabel({
  hasError,
  isLoading,
  isSubmitting
}: Omit<ChatStatusProps, 'activeAuthor' | 'messageCount'>) {
  if (hasError) {
    return 'Needs retry'
  }

  if (isLoading) {
    return 'Loading'
  }

  if (isSubmitting) {
    return 'Sending'
  }

  return 'Connected'
}

export function ChatStatus({
  activeAuthor,
  hasError,
  isLoading,
  isSubmitting,
  messageCount
}: ChatStatusProps) {
  return (
    <section className="chat-status" aria-label="Chat status">
      <p className="chat-status__eyebrow">Session status</p>
      <div className="chat-status__row">
        <span className="status-pill">{getStatusLabel({ hasError, isLoading, isSubmitting })}</span>
        <span className="status-pill status-pill--muted">
          {messageCount} {messageCount === 1 ? 'message' : 'messages'}
        </span>
      </div>
      <p className="chat-status__body">
        {activeAuthor ? `Posting as ${activeAuthor}.` : 'Enter a name to start posting.'}
      </p>
    </section>
  )
}
