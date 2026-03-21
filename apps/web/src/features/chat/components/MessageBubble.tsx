import { cx } from '../../../utils/cx'
import { formatMessageTimestamp } from '../../../utils/formatMessageTimestamp'
import type { ChatMessage } from '../types/chat'

interface MessageBubbleProps {
  isOwnMessage: boolean
  message: ChatMessage
}

function getInitials(author: string) {
  const [first = '', second = ''] = author.trim().split(/\s+/)
  return `${first.charAt(0)}${second.charAt(0)}`.trim().toUpperCase() || '??'
}

export function MessageBubble({ isOwnMessage, message }: MessageBubbleProps) {
  const variant = message.author === 'System' ? 'system' : isOwnMessage ? 'outgoing' : 'incoming'

  return (
    <article className={cx('message-bubble', `message-bubble--${variant}`)}>
      <div className="message-bubble__avatar" aria-hidden="true">
        {getInitials(message.author)}
      </div>
      <div className="message-bubble__content">
        <header className="message-bubble__meta">
          <span>{message.author}</span>
          <time dateTime={message.createdAt}>{formatMessageTimestamp(message.createdAt)}</time>
        </header>
        <p className="message-bubble__body">{message.message}</p>
      </div>
    </article>
  )
}
