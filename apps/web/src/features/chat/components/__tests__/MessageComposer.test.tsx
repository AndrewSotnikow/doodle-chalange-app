import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { MessageComposer } from '../MessageComposer'

function MessageComposerHarness({
  onAuthorChangeSpy,
  onMessageChangeSpy,
  onSubmit
}: {
  onAuthorChangeSpy: (author: string) => void
  onMessageChangeSpy: (message: string) => void
  onSubmit: () => Promise<void>
}) {
  const [author, setAuthor] = useState('')
  const [message, setMessage] = useState('')

  return (
    <MessageComposer
      author={author}
      isSubmitting={false}
      message={message}
      onAuthorChange={(nextAuthor) => {
        onAuthorChangeSpy(nextAuthor)
        setAuthor(nextAuthor)
      }}
      onMessageChange={(nextMessage) => {
        onMessageChangeSpy(nextMessage)
        setMessage(nextMessage)
      }}
      onSubmit={onSubmit}
      submitError={null}
    />
  )
}

describe('MessageComposer', () => {
  it('delegates form field updates and submit interactions', async () => {
    const user = userEvent.setup()
    const onAuthorChange = vi.fn()
    const onMessageChange = vi.fn()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <MessageComposerHarness
        onAuthorChangeSpy={onAuthorChange}
        onMessageChangeSpy={onMessageChange}
        onSubmit={onSubmit}
      />
    )

    await user.type(screen.getByLabelText('Name'), 'Jane')
    await user.type(screen.getByLabelText('Message'), 'Hello')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(onAuthorChange).toHaveBeenCalled()
    expect(onMessageChange).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('supports keyboard submission from the message field', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(
      <MessageComposer
        author="Jane"
        isSubmitting={false}
        message="Hello"
        onAuthorChange={vi.fn()}
        onMessageChange={vi.fn()}
        onSubmit={onSubmit}
        submitError={null}
      />
    )

    await user.click(screen.getByLabelText('Message'))
    await user.keyboard('{Control>}{Enter}{/Control}')

    expect(onSubmit).toHaveBeenCalledTimes(1)
  })
})
