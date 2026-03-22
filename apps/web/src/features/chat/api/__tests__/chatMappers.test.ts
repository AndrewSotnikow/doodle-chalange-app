import { describe, expect, it } from 'vitest'
import {
  mergeChatMessages,
  mapChatMessage,
  mapChatMessages,
  normalizeCreateMessageInput,
  upsertChatMessage
} from '../chatMappers'

describe('chatMappers', () => {
  it('trims outbound message input before submission', () => {
    expect(
      normalizeCreateMessageInput({
        author: '  Jane Doe  ',
        message: '  Hello world  '
      })
    ).toEqual({
      author: 'Jane Doe',
      message: 'Hello world'
    })
  })

  it('maps a backend message payload into the frontend shape', () => {
    expect(
      mapChatMessage({
        _id: 'message-1',
        author: '  Jane Doe ',
        message: ' Hello ',
        createdAt: '2026-03-22T08:00:00.000Z'
      })
    ).toEqual({
      id: 'message-1',
      author: 'Jane Doe',
      message: 'Hello',
      createdAt: '2026-03-22T08:00:00.000Z'
    })
  })

  it('sorts mapped messages into chronological order', () => {
    const result = mapChatMessages([
      {
        _id: 'message-2',
        author: 'B',
        message: 'second',
        createdAt: '2026-03-22T10:00:00.000Z'
      },
      {
        _id: 'message-1',
        author: 'A',
        message: 'first',
        createdAt: '2026-03-22T09:00:00.000Z'
      }
    ])

    expect(result.map((message) => message.id)).toEqual(['message-1', 'message-2'])
  })

  it('upserts a message and preserves chronological ordering', () => {
    const result = upsertChatMessage(
      [
        {
          id: 'message-1',
          author: 'Jane',
          message: 'hello',
          createdAt: '2026-03-22T09:00:00.000Z'
        },
        {
          id: 'message-3',
          author: 'Jane',
          message: 'later',
          createdAt: '2026-03-22T11:00:00.000Z'
        }
      ],
      {
        id: 'message-2',
        author: 'John',
        message: 'middle',
        createdAt: '2026-03-22T10:00:00.000Z'
      }
    )

    expect(result.map((message) => message.id)).toEqual([
      'message-1',
      'message-2',
      'message-3'
    ])
  })

  it('merges paginated messages without duplicating entries', () => {
    const result = mergeChatMessages(
      [
        {
          id: 'message-2',
          author: 'Jane',
          message: 'middle',
          createdAt: '2026-03-22T10:00:00.000Z'
        },
        {
          id: 'message-3',
          author: 'Jane',
          message: 'later',
          createdAt: '2026-03-22T11:00:00.000Z'
        }
      ],
      [
        {
          id: 'message-1',
          author: 'John',
          message: 'first',
          createdAt: '2026-03-22T09:00:00.000Z'
        },
        {
          id: 'message-2',
          author: 'Jane',
          message: 'middle',
          createdAt: '2026-03-22T10:00:00.000Z'
        }
      ]
    )

    expect(result.map((message) => message.id)).toEqual([
      'message-1',
      'message-2',
      'message-3'
    ])
  })
})
