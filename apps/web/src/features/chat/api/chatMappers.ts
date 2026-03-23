import type { ChatMessage, CreateMessageInput } from '../types/chat'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function expectString(value: unknown, field: string) {
  if (typeof value !== 'string') {
    throw new Error(`Invalid message payload: expected ${field} to be a string.`)
  }

  return value
}

function compareByCreatedAt(left: ChatMessage, right: ChatMessage) {
  return left.createdAt < right.createdAt ? -1 : left.createdAt > right.createdAt ? 1 : 0
}

export function normalizeCreateMessageInput(input: CreateMessageInput): CreateMessageInput {
  return {
    author: input.author.trim(),
    message: input.message.trim()
  }
}

export function mapChatMessage(payload: unknown): ChatMessage {
  if (!isRecord(payload)) {
    throw new Error('Invalid message payload: expected an object.')
  }

  return {
    id: expectString(payload._id, '_id'),
    author: expectString(payload.author, 'author').trim(),
    message: expectString(payload.message, 'message').trim(),
    createdAt: expectString(payload.createdAt, 'createdAt')
  }
}

export function mapChatMessages(payload: unknown): ChatMessage[] {
  if (!Array.isArray(payload)) {
    throw new Error('Invalid messages payload: expected an array.')
  }

  return payload.map(mapChatMessage).sort(compareByCreatedAt)
}

export function mergeChatMessages(messages: ChatMessage[], nextMessages: ChatMessage[]) {
  const mergedMessages = new Map(messages.map((message) => [message.id, message]))

  nextMessages.forEach((message) => {
    mergedMessages.set(message.id, message)
  })

  return [...mergedMessages.values()].sort(compareByCreatedAt)
}

export function upsertChatMessage(messages: ChatMessage[], nextMessage: ChatMessage) {
  return [...messages.filter((message) => message.id !== nextMessage.id), nextMessage].sort(
    compareByCreatedAt
  )
}
