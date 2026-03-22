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
        hasOlderMessages={false}
        isLoading
        isLoadingOlder={false}
        loadOlderError={null}
        messages={[]}
        onLoadOlder={vi.fn().mockResolvedValue(undefined)}
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
        hasOlderMessages={false}
        isLoading={false}
        isLoadingOlder={false}
        loadOlderError={null}
        messages={[]}
        onLoadOlder={vi.fn().mockResolvedValue(undefined)}
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
        hasOlderMessages={false}
        isLoading={false}
        isLoadingOlder={false}
        loadOlderError={null}
        messages={[]}
        onLoadOlder={vi.fn().mockResolvedValue(undefined)}
        onRetry={onRetry}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Feed unavailable')
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders the pagination control and delegates loading older messages', async () => {
    const user = userEvent.setup()
    const onLoadOlder = vi.fn().mockResolvedValue(undefined)

    render(
      <MessageList
        currentAuthor=""
        error={null}
        hasOlderMessages
        isLoading={false}
        isLoadingOlder={false}
        loadOlderError={null}
        messages={[
          {
            id: 'message-1',
            author: 'Jane',
            message: 'Hello',
            createdAt: '2026-03-22T09:00:00.000Z'
          }
        ]}
        onLoadOlder={onLoadOlder}
        onRetry={vi.fn().mockResolvedValue(undefined)}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Load earlier messages' }))

    expect(onLoadOlder).toHaveBeenCalledTimes(1)
  })
})
