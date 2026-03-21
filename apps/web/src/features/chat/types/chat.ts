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

export interface ChatPreviewMessage {
  id: string
  author: string
  message: string
  timestampLabel: string
  variant: 'incoming' | 'outgoing' | 'system'
}
