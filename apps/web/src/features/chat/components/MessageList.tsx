import type { ChatPreviewMessage } from '../types/chat'
import { MessageBubble } from './MessageBubble'

interface MessageListProps {
  messages: ChatPreviewMessage[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <section className="message-list" aria-labelledby="message-list-title">
      <div className="message-list__header">
        <div>
          <p className="section-label">Render boundary</p>
          <h3 id="message-list-title">Message list placeholder</h3>
        </div>
        <p className="message-list__caption">
          Static preview data only. Fetching and mutations are intentionally absent from
          this layer.
        </p>
      </div>
      <div className="message-list__items">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </section>
  )
}
