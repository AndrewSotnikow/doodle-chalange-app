import { cx } from '../../../utils/cx'
import { formatMessageTimestamp } from '../../../utils/formatMessageTimestamp'
import type { ChatMessage } from '../types/chat'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const variant = message.author === 'System' ? 'system' : 'incoming'

  return (
    <article className={cx('message-bubble', `message-bubble--${variant}`)}>
      <header className="message-bubble__meta">
        <span>{message.author}</span>
        <time dateTime={message.createdAt}>{formatMessageTimestamp(message.createdAt)}</time>
      </header>
      <p className="message-bubble__body">{message.message}</p>
    </article>
  )
}
