import { cx } from '../../../utils/cx'
import type { ChatPreviewMessage } from '../types/chat'

interface MessageBubbleProps {
  message: ChatPreviewMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <article className={cx('message-bubble', `message-bubble--${message.variant}`)}>
      <header className="message-bubble__meta">
        <span>{message.author}</span>
        <time>{message.timestampLabel}</time>
      </header>
      <p className="message-bubble__body">{message.message}</p>
    </article>
  )
}
