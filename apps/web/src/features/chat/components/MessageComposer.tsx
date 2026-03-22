import { useEffect, useId, useRef } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
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
  const authorInputId = useId()
  const messageInputId = useId()
  const helperTextId = useId()
  const errorTextId = useId()
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null)
  const wasSubmittingRef = useRef(false)

  useEffect(() => {
    if (wasSubmittingRef.current && !isSubmitting && !submitError && message === '') {
      messageInputRef.current?.focus()
    }

    wasSubmittingRef.current = isSubmitting
  }, [isSubmitting, message, submitError])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit()
  }

  async function handleMessageKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      await onSubmit()
    }
  }

  return (
    <section className="composer-card" aria-labelledby="composer-title">
      <div>
        <p className="section-label">Compose</p>
        <h3 id="composer-title">Message composer</h3>
        <p className="composer-card__lead">
          Keep your name in place and send consecutive messages without resetting the form.
        </p>
      </div>
      <form className="composer-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            aria-describedby={helperTextId}
            autoComplete="name"
            disabled={isSubmitting}
            id={authorInputId}
            maxLength={CHAT_LIMITS.authorMaxLength}
            onChange={(event) => onAuthorChange(event.target.value)}
            placeholder="Jane Doe"
            required
            type="text"
            value={author}
          />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea
            aria-describedby={submitError ? `${helperTextId} ${errorTextId}` : helperTextId}
            aria-invalid={Boolean(submitError)}
            disabled={isSubmitting}
            id={messageInputId}
            maxLength={CHAT_LIMITS.messageMaxLength}
            onChange={(event) => onMessageChange(event.target.value)}
            onKeyDown={(event) => void handleMessageKeyDown(event)}
            placeholder="Send a message to the chat API."
            ref={messageInputRef}
            required
            rows={4}
            spellCheck
            value={message}
          />
        </label>
        <div className="composer-card__meta">
          <p className="field__hint" id={helperTextId}>
            Up to {CHAT_LIMITS.authorMaxLength} characters for author and{' '}
            {CHAT_LIMITS.messageMaxLength} for message.
          </p>
          <p className="field__hint">{message.length} / {CHAT_LIMITS.messageMaxLength}</p>
        </div>
        {submitError ? (
          <p className="status-copy status-copy--error" id={errorTextId} role="alert">
            {submitError}
          </p>
        ) : null}
        <div className="composer-card__actions">
          <p className="field__hint">Press Ctrl/Cmd + Enter to send quickly.</p>
          <button className="button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Sending...' : 'Send message'}
          </button>
        </div>
      </form>
    </section>
  )
}
