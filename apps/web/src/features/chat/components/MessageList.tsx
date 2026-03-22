import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type { ChatMessage } from '../types/chat'
import { ChatNotice } from './ChatNotice'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  currentAuthor: string
  error: string | null
  hasOlderMessages: boolean
  isLoading: boolean
  isLoadingOlder: boolean
  loadOlderError: string | null
  messages: ChatMessage[]
  onLoadOlder: () => Promise<void>
  onRetry: () => Promise<void>
}

export function MessageList({
  currentAuthor,
  error,
  hasOlderMessages,
  isLoading,
  isLoadingOlder,
  loadOlderError,
  messages,
  onLoadOlder,
  onRetry
}: MessageListProps) {
  const feedRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const previousMessagesRef = useRef<ChatMessage[]>([])
  const loadOlderSnapshotRef = useRef<{
    previousFirstMessageId?: string
    scrollHeight: number
    scrollTop: number
  } | null>(null)

  const handleLoadOlder = useCallback(async () => {
    const feedElement = feedRef.current

    if (feedElement) {
      loadOlderSnapshotRef.current = {
        previousFirstMessageId: messages[0]?.id,
        scrollHeight: feedElement.scrollHeight,
        scrollTop: feedElement.scrollTop
      }
    }

    await onLoadOlder()
  }, [messages, onLoadOlder])

  useLayoutEffect(() => {
    const feedElement = feedRef.current
    if (!feedElement) {
      previousMessagesRef.current = messages
      return
    }

    const previousMessages = previousMessagesRef.current
    const loadOlderSnapshot = loadOlderSnapshotRef.current
    const didPrependOlderMessages =
      previousMessages.length > 0 &&
      messages.length > previousMessages.length &&
      messages[0]?.id !== previousMessages[0]?.id &&
      messages[messages.length - 1]?.id === previousMessages[previousMessages.length - 1]?.id

    if (loadOlderSnapshot && !isLoadingOlder) {
      if (didPrependOlderMessages) {
        const nextScrollTop =
          loadOlderSnapshot.scrollTop +
          (feedElement.scrollHeight - loadOlderSnapshot.scrollHeight)
        feedElement.scrollTop = nextScrollTop
      }

      loadOlderSnapshotRef.current = null
    } else if (messages.length > 0) {
      const isInitialLoad = previousMessages.length === 0
      const appendedNewMessage =
        previousMessages.length > 0 &&
        messages[messages.length - 1]?.id !== previousMessages[previousMessages.length - 1]?.id

      if (isInitialLoad || appendedNewMessage) {
        feedElement.scrollTop = feedElement.scrollHeight
      }
    }

    previousMessagesRef.current = messages
  }, [isLoadingOlder, messages])

  useEffect(() => {
    const sentinel = sentinelRef.current
    const scrollContainer = feedRef.current

    if (!sentinel || !scrollContainer || !hasOlderMessages || isLoadingOlder || loadOlderError) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void handleLoadOlder()
        }
      },
      { root: scrollContainer, rootMargin: '200px 0px 0px 0px', threshold: 0 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasOlderMessages, isLoadingOlder, loadOlderError, handleLoadOlder])

  return (
    <section
      aria-busy={isLoading || isLoadingOlder}
      className="message-list"
      aria-labelledby="message-list-title"
    >
      <h2 className="sr-only" id="message-list-title">
        Shared feed
      </h2>

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
          {hasOlderMessages && !loadOlderError && (
            <div aria-hidden="true" className="message-list__sentinel" ref={sentinelRef} />
          )}
          {(hasOlderMessages || loadOlderError) && (
            <div className="message-list__pagination">
              {loadOlderError ? (
                <p className="message-list__pagination-error" role="status">
                  {loadOlderError}
                </p>
              ) : null}
              <button
                className="message-list__pagination-button"
                disabled={isLoadingOlder}
                onClick={() => void handleLoadOlder()}
                type="button"
              >
                {isLoadingOlder
                  ? 'Loading earlier messages...'
                  : loadOlderError
                    ? 'Retry loading earlier messages'
                    : 'Load earlier messages'}
              </button>
            </div>
          )}
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
