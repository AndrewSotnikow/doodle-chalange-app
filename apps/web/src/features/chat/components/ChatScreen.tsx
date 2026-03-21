import { useChatScreen } from '../hooks/useChatScreen'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'

export function ChatScreen() {
  const { notes, previewMessages } = useChatScreen()

  return (
    <section className="surface-card" aria-labelledby="chat-screen-title">
      <div className="surface-card__header">
        <div>
          <p className="section-label">Feature scaffold</p>
          <h2 id="chat-screen-title">Chat boundaries before behavior</h2>
        </div>
        <p className="surface-card__lead">
          The UI is intentionally static at this stage. Components, hooks, and services
          are separated so the next checkpoint can add real data flow without structural
          churn.
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
          <MessageList messages={previewMessages} />
          <MessageComposer />
        </div>
      </div>
    </section>
  )
}
