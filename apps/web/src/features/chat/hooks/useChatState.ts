import { useEffect, useState } from 'react'
import { toErrorMessage } from '../../../api/requestJson'
import { chatApi } from '../api/chatApi'
import { mergeChatMessages, upsertChatMessage } from '../api/chatMappers'
import { CHAT_LIMITS, type ChatMessage, type CreateMessageInput } from '../types/chat'

const INITIAL_DRAFT: CreateMessageInput = {
  author: '',
  message: ''
}

function validateDraft(draft: CreateMessageInput) {
  const author = draft.author.trim()
  const message = draft.message.trim()

  if (!author || !message) {
    return 'Author and message are required.'
  }

  if (author.length > CHAT_LIMITS.authorMaxLength) {
    return `Author cannot exceed ${CHAT_LIMITS.authorMaxLength} characters.`
  }

  if (message.length > CHAT_LIMITS.messageMaxLength) {
    return `Message cannot exceed ${CHAT_LIMITS.messageMaxLength} characters.`
  }

  return null
}

function createLatestMessagesQuery() {
  return {
    before: new Date().toISOString(),
    limit: CHAT_LIMITS.defaultMessagesLimit
  }
}

export function useChatState() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState<CreateMessageInput>(INITIAL_DRAFT)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingOlder, setIsLoadingOlder] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasOlderMessages, setHasOlderMessages] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loadOlderError, setLoadOlderError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('Loading messages.')

  async function syncMessages(signal?: AbortSignal) {
    setLoadError(null)
    setLoadOlderError(null)
    setStatusMessage('Loading messages.')

    try {
      const nextMessages = await chatApi.listMessages(createLatestMessagesQuery(), { signal })
      setMessages(nextMessages)
      setHasOlderMessages(nextMessages.length === CHAT_LIMITS.defaultMessagesLimit)
      setStatusMessage(
        nextMessages.length > 0
          ? `${nextMessages.length} messages loaded.`
          : 'No messages are available yet.'
      )
    } catch (error) {
      if (signal?.aborted) {
        return
      }

      const nextErrorMessage = toErrorMessage(error)
      setLoadError(nextErrorMessage)
      setStatusMessage(nextErrorMessage)
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    void syncMessages(controller.signal)

    return () => {
      controller.abort()
    }
  }, [])

  function updateAuthor(author: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      author
    }))
  }

  function updateMessage(message: string) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      message
    }))
  }

  async function submitMessage() {
    if (isSubmitting) {
      return
    }

    const validationError = validateDraft(draft)
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    setStatusMessage('Sending message.')

    try {
      const nextAuthor = draft.author.trim()
      const createdMessage = await chatApi.createMessage(draft)
      setMessages((currentMessages) => upsertChatMessage(currentMessages, createdMessage))
      setDraft({
        author: nextAuthor,
        message: ''
      })
      setStatusMessage('Message sent.')
    } catch (error) {
      const nextErrorMessage = toErrorMessage(error)
      setSubmitError(nextErrorMessage)
      setStatusMessage(nextErrorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function loadOlderMessages() {
    const oldestMessage = messages[0]

    if (!oldestMessage || isLoading || isLoadingOlder) {
      return
    }

    setIsLoadingOlder(true)
    setLoadOlderError(null)

    try {
      const olderMessages = await chatApi.listMessages({
        before: oldestMessage.createdAt,
        limit: CHAT_LIMITS.defaultMessagesLimit
      })

      setMessages((currentMessages) => mergeChatMessages(currentMessages, olderMessages))
      setHasOlderMessages(olderMessages.length === CHAT_LIMITS.defaultMessagesLimit)
      setStatusMessage(
        olderMessages.length > 0
          ? `${olderMessages.length} older messages loaded.`
          : 'No older messages are available.'
      )
    } catch (error) {
      const nextErrorMessage = toErrorMessage(error)
      setLoadOlderError(nextErrorMessage)
      setStatusMessage(nextErrorMessage)
    } finally {
      setIsLoadingOlder(false)
    }
  }

  async function retryMessages() {
    setIsLoading(true)
    await syncMessages()
  }

  return {
    author: draft.author,
    message: draft.message,
    messages,
    hasOlderMessages,
    isLoading,
    isLoadingOlder,
    isSubmitting,
    loadError,
    loadOlderError,
    submitError,
    statusMessage,
    loadOlderMessages,
    updateAuthor,
    updateMessage,
    retryMessages,
    submitMessage
  }
}
