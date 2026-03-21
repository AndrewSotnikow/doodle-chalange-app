import { useChatScreen } from '../hooks/useChatScreen'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

export function ChatScreen() {
  const {
    author,
    loadError,
    isLoading,
    isSubmitting,
    message,
    messages,
    notes,
    retryMessages,
    submitError,
    submitMessage,
    updateAuthor,
    updateMessage
  } = useChatScreen()

  return (
    <section className="surface-card" aria-labelledby="chat-screen-title">
      <div className="surface-card__header">
        <div>
          <p className="section-label">State layer connected</p>
          <h2 id="chat-screen-title">Typed API and state orchestration</h2>
        </div>
        <p className="surface-card__lead">
          Network concerns are isolated behind a typed API client and a feature hook.
          These components render state only and do not know how messages are fetched or
          submitted.
        </p>
      </div>

      <div className="grid-stack">
        <div className="note-grid">
          {notes.map((note) => (
            <article className="note-card" key={note.title}>
              <p className="note-card__title">{note.title}</p>
              <p className="note-card__body">{note.description}</p>
            </article>
          ))}
        </div>

        <div className="chat-preview">
          <MessageList
            error={loadError}
            isLoading={isLoading}
            messages={messages}
            onRetry={retryMessages}
          />
          <MessageComposer
            author={author}
            isSubmitting={isSubmitting}
            message={message}
            onAuthorChange={updateAuthor}
            onMessageChange={updateMessage}
            onSubmit={submitMessage}
            submitError={submitError}
          />
        </div>
      </div>
    </section>
  )
}
