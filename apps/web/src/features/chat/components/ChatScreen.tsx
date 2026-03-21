import { ChatStatus } from './ChatStatus'
import { useChatScreen } from '../hooks/useChatScreen'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

export function ChatScreen() {
  const {
    activeAuthor,
    author,
    loadError,
    isLoading,
    isSubmitting,
    message,
    messages,
    messageCount,
    retryMessages,
    submitError,
    submitMessage,
    updateAuthor,
    updateMessage
  } = useChatScreen()

  return (
    <section className="surface-card chat-screen" aria-labelledby="chat-screen-title">
      <div className="chat-screen__hero">
        <div>
          <p className="section-label">Doodle challenge chat</p>
          <h2 id="chat-screen-title">Shared conversation</h2>
        </div>
        <p className="surface-card__lead">
          The message feed and composer are now a working end-to-end interface. Data
          loading and submission stay in the feature hook, while each component owns only
          its slice of rendering and local interaction.
        </p>
        <ChatStatus
          activeAuthor={activeAuthor}
          hasError={Boolean(loadError)}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          messageCount={messageCount}
        />
      </div>

      <div className="chat-layout">
        <div className="chat-layout__main">
          <MessageList
            currentAuthor={activeAuthor}
            error={loadError}
            isLoading={isLoading}
            messages={messages}
            onRetry={retryMessages}
          />
        </div>
        <aside className="chat-layout__side">
          <MessageComposer
            author={author}
            isSubmitting={isSubmitting}
            message={message}
            onAuthorChange={updateAuthor}
            onMessageChange={updateMessage}
            onSubmit={submitMessage}
            submitError={submitError}
          />
        </aside>
      </div>
    </section>
  )
}
