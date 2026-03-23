import { requestJson } from '../../../api/requestJson'
import { env } from '../../../config/env'
import { mapChatMessage, mapChatMessages, normalizeCreateMessageInput } from './chatMappers'
import type { ChatMessage, CreateMessageInput, MessagesQuery } from '../types/chat'

interface RequestOptions {
  signal?: AbortSignal
}

function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${env.apiToken}` }
}

function jsonHeaders(): HeadersInit {
  return { ...authHeaders(), 'Content-Type': 'application/json' }
}

function buildMessagesUrl(params?: MessagesQuery) {
  const url = new URL('messages', `${env.apiBaseUrl}/`)

  if (!params) {
    return url.toString()
  }

  if (typeof params.limit === 'number') {
    url.searchParams.set('limit', params.limit.toString())
  }

  if (params.after) {
    url.searchParams.set('after', params.after)
  }

  if (params.before) {
    url.searchParams.set('before', params.before)
  }

  return url.toString()
}

export const chatApi = {
  async listMessages(
    params?: MessagesQuery,
    options?: RequestOptions
  ): Promise<ChatMessage[]> {
    const payload = await requestJson(buildMessagesUrl(params), {
      headers: authHeaders(),
      signal: options?.signal
    })

    return mapChatMessages(payload)
  },
  async createMessage(
    input: CreateMessageInput,
    options?: RequestOptions
  ): Promise<ChatMessage> {
    const payload = await requestJson(buildMessagesUrl(), {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(normalizeCreateMessageInput(input)),
      signal: options?.signal
    })

    return mapChatMessage(payload)
  }
}
