import { useEffect, useState } from 'react'
import { toErrorMessage } from '../../../api/requestJson'
import { chatApi } from '../api/chatApi'
import { upsertChatMessage } from '../api/chatMappers'
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

export function useChatState() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState<CreateMessageInput>(INITIAL_DRAFT)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function syncMessages(signal?: AbortSignal) {
    setLoadError(null)

    try {
      const nextMessages = await chatApi.listMessages(
        { limit: CHAT_LIMITS.defaultMessagesLimit },
        { signal }
      )
      setMessages(nextMessages)
    } catch (error) {
      if (signal?.aborted) {
        return
      }

      setLoadError(toErrorMessage(error))
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
    const validationError = validateDraft(draft)
    if (validationError) {
      setSubmitError(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const nextAuthor = draft.author.trim()
      const createdMessage = await chatApi.createMessage(draft)
      setMessages((currentMessages) => upsertChatMessage(currentMessages, createdMessage))
      setDraft({
        author: nextAuthor,
        message: ''
      })
    } catch (error) {
      setSubmitError(toErrorMessage(error))
    } finally {
      setIsSubmitting(false)
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
    isLoading,
    isSubmitting,
    loadError,
    submitError,
    updateAuthor,
    updateMessage,
    retryMessages,
    submitMessage
  }
}
