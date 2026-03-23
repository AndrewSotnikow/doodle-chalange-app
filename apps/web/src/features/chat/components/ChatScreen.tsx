import { useChatState } from '../hooks/useChatState'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

export function ChatScreen() {
  const {
    author,
    loadError,
    isLoading,
    isLoadingOlder,
    isSubmitting,
    hasOlderMessages,
    loadOlderError,
    message,
    messages,
    loadOlderMessages,
    retryMessages,
    statusMessage,
    submitError,
    submitMessage,
    updateAuthor,
    updateMessage
  } = useChatState()

  const activeAuthor = author.trim()
  const messageCount = messages.length

  return (
    <section className="chat-screen" aria-labelledby="chat-screen-title">
      <p aria-atomic="true" aria-live="polite" className="sr-only">
        {statusMessage}
      </p>
      <h1 className="sr-only" id="chat-screen-title">
        Doodle challenge chat
      </h1>

      <div className="chat-screen__canvas">
        <header className="chat-screen__meta" aria-label="Conversation metadata">
          <p className="chat-screen__identity">
            {activeAuthor ? (
              <>
                Posting as <strong>{activeAuthor}</strong>
              </>
            ) : (
              'Choose a name to join the conversation.'
            )}
          </p>
          <p className="chat-screen__count">
            {messageCount} {messageCount === 1 ? 'message' : 'messages'}
          </p>
        </header>

        <div className="chat-screen__feed">
          <MessageList
            currentAuthor={activeAuthor}
            error={loadError}
            hasOlderMessages={hasOlderMessages}
            isLoading={isLoading}
            isLoadingOlder={isLoadingOlder}
            loadOlderError={loadOlderError}
            messages={messages}
            onLoadOlder={loadOlderMessages}
            onRetry={retryMessages}
          />
        </div>
      </div>

      <MessageComposer
        author={author}
        isSubmitting={isSubmitting}
        message={message}
        onAuthorChange={updateAuthor}
        onMessageChange={updateMessage}
        onSubmit={submitMessage}
        submitError={submitError}
      />
    </section>
  )
}
