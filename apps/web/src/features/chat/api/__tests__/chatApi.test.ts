import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError } from '../../../../api/requestJson'
import { chatApi } from '../chatApi'

const { requestJsonMock } = vi.hoisted(() => ({
  requestJsonMock: vi.fn()
}))

vi.mock('../../../../api/requestJson', async () => {
  const actual = await vi.importActual<typeof import('../../../../api/requestJson')>(
    '../../../../api/requestJson'
  )

  return {
    ...actual,
    requestJson: requestJsonMock
  }
})

describe('chatApi', () => {
  beforeEach(() => {
    requestJsonMock.mockReset()
  })

  it('requests and maps message lists through the service layer', async () => {
    requestJsonMock.mockResolvedValue([
      {
        _id: 'message-2',
        author: 'John',
        message: 'second',
        createdAt: '2026-03-22T10:00:00.000Z'
      },
      {
        _id: 'message-1',
        author: 'Jane',
        message: 'first',
        createdAt: '2026-03-22T09:00:00.000Z'
      }
    ])

    const result = await chatApi.listMessages({ limit: 25 })

    expect(requestJsonMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/messages?limit=25',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer super-secret-doodle-token'
        })
      })
    )
    expect(requestJsonMock.mock.calls[0][1].headers).not.toHaveProperty('Content-Type')
    expect(result.map((message) => message.id)).toEqual(['message-1', 'message-2'])
  })

  it('posts trimmed input and maps the created message', async () => {
    requestJsonMock.mockResolvedValue({
      _id: 'message-3',
      author: 'Jane Doe',
      message: 'Hello there',
      createdAt: '2026-03-22T12:00:00.000Z'
    })

    const result = await chatApi.createMessage({
      author: '  Jane Doe ',
      message: '  Hello there '
    })

    expect(requestJsonMock).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/messages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          author: 'Jane Doe',
          message: 'Hello there'
        })
      })
    )
    expect(result).toEqual({
      id: 'message-3',
      author: 'Jane Doe',
      message: 'Hello there',
      createdAt: '2026-03-22T12:00:00.000Z'
    })
  })

  it('propagates request failures from the transport layer', async () => {
    requestJsonMock.mockRejectedValue(new ApiRequestError('Unauthorized', 401))

    await expect(chatApi.listMessages()).rejects.toThrow('Unauthorized')
  })
})
