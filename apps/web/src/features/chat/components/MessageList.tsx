import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../types/chat'
import { ChatNotice } from './ChatNotice'
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
    <section aria-busy={isLoading} className="message-list" aria-labelledby="message-list-title">
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
        <ChatNotice
          description="Fetching the latest conversation from the API."
          title="Loading messages..."
        />
      ) : null}

      {!isLoading && error ? (
        <ChatNotice
          actionLabel="Retry"
          description="The message feed could not be refreshed."
          onAction={() => void onRetry()}
          role="alert"
          title={error}
          tone="error"
        />
      ) : null}

      {!isLoading && !error && messages.length === 0 ? (
        <ChatNotice
          description="Send the first message from the composer to start the conversation."
          title="No messages yet"
        />
      ) : null}

      {!isLoading && !error && messages.length > 0 ? (
        <div
          aria-label="Chat messages"
          aria-live="polite"
          aria-relevant="additions text"
          className="message-list__items"
          ref={feedRef}
          role="log"
        >
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
