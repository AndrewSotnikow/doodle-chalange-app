import type { FormEvent } from 'react'
import { CHAT_LIMITS } from '../types/chat'

interface MessageComposerProps {
  author: string
  message: string
  isSubmitting: boolean
  submitError: string | null
  onAuthorChange: (author: string) => void
  onMessageChange: (message: string) => void
  onSubmit: () => Promise<void>
}

export function MessageComposer({
  author,
  isSubmitting,
  message,
  onAuthorChange,
  onMessageChange,
  onSubmit,
  submitError
}: MessageComposerProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit()
  }

  return (
    <section className="composer-card" aria-labelledby="composer-title">
      <div>
        <p className="section-label">Submit boundary</p>
        <h3 id="composer-title">Message composer</h3>
      </div>
      <form className="composer-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            maxLength={CHAT_LIMITS.authorMaxLength}
            onChange={(event) => onAuthorChange(event.target.value)}
            placeholder="Jane Doe"
            type="text"
            value={author}
          />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea
            maxLength={CHAT_LIMITS.messageMaxLength}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder="Send a message to the chat API."
            rows={4}
            value={message}
          />
        </label>
        <p className="field__hint">
          Up to {CHAT_LIMITS.authorMaxLength} characters for author and{' '}
          {CHAT_LIMITS.messageMaxLength} for message.
        </p>
        {submitError ? (
          <p className="status-copy status-copy--error" role="alert">
            {submitError}
          </p>
        ) : null}
        <button className="button" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Sending...' : 'Send message'}
        </button>
      </form>
    </section>
  )
}
