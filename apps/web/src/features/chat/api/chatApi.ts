import { env } from '../../../config/env'
import type {
  ChatMessage,
  CreateMessageInput,
  MessagesQuery
} from '../types/chat'

function createHeaders() {
  return {
    Authorization: `Bearer ${env.apiToken}`,
    'Content-Type': 'application/json'
  }
}

export const chatApi = {
  async listMessages(params?: MessagesQuery): Promise<ChatMessage[]> {
    void params
    console.info('Chat API placeholder configured for', env.apiBaseUrl)
    console.info('Request headers prepared with token length', createHeaders().Authorization.length)
    return []
  },
  async createMessage(input: CreateMessageInput): Promise<ChatMessage> {
    void input
    throw new Error('Chat submission is intentionally deferred until the next checkpoint.')
  }
}
