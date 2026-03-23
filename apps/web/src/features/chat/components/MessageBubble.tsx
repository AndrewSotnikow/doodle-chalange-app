import { memo } from 'react'
import { cx } from '../../../utils/cx'
import { formatMessageTimestamp } from '../../../utils/formatMessageTimestamp'
import type { ChatMessage } from '../types/chat'

interface MessageBubbleProps {
  isOwnMessage: boolean
  message: ChatMessage
}

export const MessageBubble = memo(function MessageBubble({
  isOwnMessage,
  message
}: MessageBubbleProps) {
  const variant = message.author === 'System' ? 'system' : isOwnMessage ? 'outgoing' : 'incoming'

  return (
    <article className={cx('message-bubble', `message-bubble--${variant}`)}>
      <div className="message-bubble__content">
        <p className="message-bubble__author">{message.author}</p>
        <p className="message-bubble__body">{message.message}</p>
        <time className="message-bubble__time" dateTime={message.createdAt}>
          {formatMessageTimestamp(message.createdAt)}
        </time>
      </div>
    </article>
  )
})
