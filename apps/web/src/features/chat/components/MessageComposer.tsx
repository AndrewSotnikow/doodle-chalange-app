import { useEffect, useId, useRef } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { TextArea } from '../../../components/TextArea'
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
  const authorHintId = useId()
  const messageHintId = useId()
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
    <section className="composer-dock" aria-labelledby="composer-title">
      <h2 className="sr-only" id="composer-title">
        Message composer
      </h2>
      <form className="composer-form" onSubmit={handleSubmit}>
        <div className="composer-dock__author">
          <label className="field field--inline" htmlFor={authorInputId}>
            <span className="sr-only">Name</span>
            <span aria-hidden="true" className="composer-dock__author-copy">
              Posting as
            </span>
            <Input
              aria-label="Name"
              aria-describedby={authorHintId}
              autoComplete="name"
              disabled={isSubmitting}
              id={authorInputId}
              maxLength={CHAT_LIMITS.authorMaxLength}
              onChange={(event) => onAuthorChange(event.target.value)}
              placeholder="Your name"
              required
              type="text"
              value={author}
            />
          </label>
          <p className="sr-only" id={authorHintId}>
            Enter the name that will appear with your messages.
          </p>
          <p className="field__hint" id={messageHintId}>
            {message.length} / {CHAT_LIMITS.messageMaxLength} characters
            {message.length >= CHAT_LIMITS.messageMaxLength && (
              <span className="field__hint--warning"> — Character limit reached</span>
            )}
            {message.length >= CHAT_LIMITS.messageMaxLength - 50 &&
              message.length < CHAT_LIMITS.messageMaxLength && (
              <span className="field__hint--warning"> — Approaching character limit</span>
            )}
          </p>
        </div>

        <div className="composer-dock__bar">
          <label className="field field--message" htmlFor={messageInputId}>
            <span className="sr-only">Message</span>
            <TextArea
              aria-label="Message"
              aria-describedby={submitError ? `${messageHintId} ${errorTextId}` : messageHintId}
              aria-invalid={Boolean(submitError)}
              disabled={isSubmitting}
              id={messageInputId}
              maxLength={CHAT_LIMITS.messageMaxLength}
              onChange={(event) => onMessageChange(event.target.value)}
              onKeyDown={(event) => void handleMessageKeyDown(event)}
              placeholder="Message"
              ref={messageInputRef}
              required
              rows={1}
              spellCheck
              value={message}
            />
          </label>
          <Button
            aria-label={isSubmitting ? 'Sending message' : 'Send message'}
            className="composer-dock__submit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </div>

        {submitError ? (
          <p className="status-copy status-copy--error" id={errorTextId} role="alert">
            {submitError}
          </p>
        ) : null}
      </form>
    </section>
  )
}
