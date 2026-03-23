const SKELETON_ROWS = [
  { align: 'incoming', bodyWidth: '70%' },
  { align: 'incoming', bodyWidth: '45%' },
  { align: 'outgoing', bodyWidth: '60%' },
  { align: 'incoming', bodyWidth: '80%' },
  { align: 'outgoing', bodyWidth: '50%' }
] as const

export function MessageSkeleton() {
  return (
    <div aria-hidden="true" className="message-skeleton" role="presentation">
      {SKELETON_ROWS.map((row, index) => (
        <div className={`message-bubble message-bubble--${row.align}`} key={index}>
          <div className="message-bubble__content message-skeleton__card">
            <div className="message-skeleton__line message-skeleton__line--author" />
            <div className="message-skeleton__line" style={{ width: row.bodyWidth }} />
            <div className="message-skeleton__line message-skeleton__line--time" />
          </div>
        </div>
      ))}
    </div>
  )
}
