import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError } from '../../../../api/requestJson'
import { CHAT_LIMITS, type ChatMessage } from '../../types/chat'
import { useChatState } from '../useChatState'

const { createMessageMock, listMessagesMock } = vi.hoisted(() => ({
  listMessagesMock: vi.fn(),
  createMessageMock: vi.fn()
}))

vi.mock('../../api/chatApi', () => ({
  chatApi: {
    listMessages: listMessagesMock,
    createMessage: createMessageMock
  }
}))

const seededMessages: ChatMessage[] = [
  {
    id: 'message-1',
    author: 'Jane',
    message: 'Hello',
    createdAt: '2026-03-22T09:00:00.000Z'
  }
]

describe('useChatState', () => {
  beforeEach(() => {
    listMessagesMock.mockReset()
    createMessageMock.mockReset()
  })

  it('loads messages on mount and exposes the settled state', async () => {
    listMessagesMock.mockResolvedValue(seededMessages)

    const { result } = renderHook(() => useChatState())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(listMessagesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        before: expect.any(String),
        limit: CHAT_LIMITS.defaultMessagesLimit
      }),
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    )
    expect(result.current.messages).toEqual(seededMessages)
    expect(result.current.statusMessage).toBe('1 messages loaded.')
  })

  it('exposes load errors from the service layer', async () => {
    listMessagesMock.mockRejectedValue(new ApiRequestError('Feed unavailable', 503))

    const { result } = renderHook(() => useChatState())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.loadError).toBe('Feed unavailable')
    expect(result.current.statusMessage).toBe('Feed unavailable')
  })

  it('submits a message, appends it, and preserves the author for follow-up messages', async () => {
    listMessagesMock.mockResolvedValue(seededMessages)
    createMessageMock.mockResolvedValue({
      id: 'message-2',
      author: 'Jane',
      message: 'Follow-up',
      createdAt: '2026-03-22T10:00:00.000Z'
    })

    const { result } = renderHook(() => useChatState())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      result.current.updateAuthor('Jane')
      result.current.updateMessage('Follow-up')
    })

    await act(async () => {
      await result.current.submitMessage()
    })

    expect(createMessageMock).toHaveBeenCalledWith({
      author: 'Jane',
      message: 'Follow-up'
    })
    expect(result.current.messages.map((message) => message.id)).toEqual([
      'message-1',
      'message-2'
    ])
    expect(result.current.author).toBe('Jane')
    expect(result.current.message).toBe('')
    expect(result.current.statusMessage).toBe('Message sent.')
  })

  it('loads older messages and prepends them in chronological order', async () => {
    const initialMessages = Array.from({ length: CHAT_LIMITS.defaultMessagesLimit }, (_, index) => ({
      id: `message-${index + 2}`,
      author: 'Jane',
      message: `Message ${index + 2}`,
      createdAt: new Date(Date.UTC(2026, 2, 22, 0, index, 0)).toISOString()
    }))
    const olderMessages: ChatMessage[] = [
      {
        id: 'message-1',
        author: 'John',
        message: 'Earlier message',
        createdAt: '2026-03-21T23:30:00.000Z'
      }
    ]

    listMessagesMock.mockResolvedValueOnce(initialMessages).mockResolvedValueOnce(olderMessages)

    const { result } = renderHook(() => useChatState())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.hasOlderMessages).toBe(true)

    await act(async () => {
      await result.current.loadOlderMessages()
    })

    expect(listMessagesMock).toHaveBeenLastCalledWith({
      before: initialMessages[0].createdAt,
      limit: CHAT_LIMITS.defaultMessagesLimit
    })
    expect(result.current.messages[0]?.id).toBe('message-1')
    expect(result.current.messages).toHaveLength(CHAT_LIMITS.defaultMessagesLimit + 1)
    expect(result.current.hasOlderMessages).toBe(false)
  })

  it('surfaces validation errors without calling the API', async () => {
    listMessagesMock.mockResolvedValue([])

    const { result } = renderHook(() => useChatState())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.submitMessage()
    })

    expect(createMessageMock).not.toHaveBeenCalled()
    expect(result.current.submitError).toBe('Author and message are required.')
  })
})
