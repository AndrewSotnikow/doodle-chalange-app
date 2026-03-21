import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types/chat'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  currentAuthor: string
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  onRetry: () => Promise<void>
}

export function MessageList({
  currentAuthor,
  error,
  isLoading,
  messages,
  onRetry
}: MessageListProps) {
  const feedRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const feedElement = feedRef.current
    if (!feedElement || messages.length === 0) {
      return
    }

    feedElement.scrollTop = feedElement.scrollHeight
  }, [messages])

  return (
    <section className="message-list" aria-labelledby="message-list-title">
      <div className="message-list__header">
        <div>
          <p className="section-label">Conversation</p>
          <h3 id="message-list-title">Shared feed</h3>
        </div>
        <p className="message-list__caption">
          New messages appear in chronological order, with the latest entry kept in view.
        </p>
      </div>

      {isLoading ? (
        <div className="message-list__state" role="status">
          Loading messages...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="message-list__state message-list__state--error" role="alert">
          <p>{error}</p>
          <button className="inline-action" onClick={() => void onRetry()} type="button">
            Retry
          </button>
        </div>
      ) : null}

      {!isLoading && !error && messages.length === 0 ? (
        <div className="message-list__state" role="status">
          No messages yet. Send the first one from the composer.
        </div>
      ) : null}

      {!isLoading && !error && messages.length > 0 ? (
        <div className="message-list__items" ref={feedRef}>
          {messages.map((message) => (
            <MessageBubble
              isOwnMessage={Boolean(currentAuthor) && currentAuthor === message.author}
              key={message.id}
              message={message}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
