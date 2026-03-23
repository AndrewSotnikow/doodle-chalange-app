export const CHAT_LIMITS = {
  authorMaxLength: 50,
  messageMaxLength: 500,
  defaultMessagesLimit: 10,
  pollIntervalMs: 10_000
} as const

export interface ChatMessage {
  id: string
  author: string
  message: string
  createdAt: string
}

export interface CreateMessageInput {
  author: string
  message: string
}

export interface MessagesQuery {
  before?: string
  after?: string
  limit?: number
}
