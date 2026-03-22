import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MessageList } from '../MessageList'

describe('MessageList', () => {
  it('renders the loading state', () => {
    render(
      <MessageList
        currentAuthor=""
        error={null}
        isLoading
        messages={[]}
        onRetry={vi.fn().mockResolvedValue(undefined)}
      />
    )

    expect(screen.getByText('Loading messages...')).toBeInTheDocument()
    expect(screen.getByText('Fetching the latest conversation from the API.')).toBeInTheDocument()
  })

  it('renders the empty state', () => {
    render(
      <MessageList
        currentAuthor=""
        error={null}
        isLoading={false}
        messages={[]}
        onRetry={vi.fn().mockResolvedValue(undefined)}
      />
    )

    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })

  it('renders the error state and delegates retry actions', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn().mockResolvedValue(undefined)

    render(
      <MessageList
        currentAuthor=""
        error="Feed unavailable"
        isLoading={false}
        messages={[]}
        onRetry={onRetry}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Feed unavailable')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
