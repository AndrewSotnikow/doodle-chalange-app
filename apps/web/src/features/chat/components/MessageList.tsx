import type { ChatMessage } from '../types/chat'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  onRetry: () => Promise<void>
}

export function MessageList({ error, isLoading, messages, onRetry }: MessageListProps) {
  return (
    <section className="message-list" aria-labelledby="message-list-title">
      <div className="message-list__header">
        <div>
          <p className="section-label">Render boundary</p>
          <h3 id="message-list-title">Message list</h3>
        </div>
        <p className="message-list__caption">
          Messages are loaded and submitted through the feature hook. This component only
          renders the current state.
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
        <div className="message-list__items">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
