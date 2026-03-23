import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { ApiRequestError, toErrorMessage } from '../../../api/requestJson'
import { chatApi } from '../api/chatApi'
import { mergeChatMessages, upsertChatMessage } from '../api/chatMappers'
import { CHAT_LIMITS, type ChatMessage, type CreateMessageInput } from '../types/chat'

const INITIAL_DRAFT: CreateMessageInput = {
  author: '',
  message: ''
}

const INITIAL_SYNC_RETRY_DELAY_MS = 500
const INITIAL_SYNC_RETRY_LIMIT = 4

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

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

function shouldRetryInitialSync(error: unknown) {
  return !(error instanceof ApiRequestError)
}

function waitForRetry(delayMs: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener('abort', handleAbort)
      resolve()
    }, delayMs)

    function handleAbort() {
      window.clearTimeout(timeoutId)
      reject(new DOMException('Aborted', 'AbortError'))
    }

    if (signal?.aborted) {
      handleAbort()
      return
    }

    signal?.addEventListener('abort', handleAbort, { once: true })
  })
}

// -- Reducer --

interface ChatState {
  messages: ChatMessage[]
  hasOlderMessages: boolean
  statusMessage: string
  feed: { status: 'loading' } | { status: 'idle' } | { status: 'error'; error: string }
  pagination: { status: 'idle' } | { status: 'loading' } | { status: 'error'; error: string }
  submission: { status: 'idle' } | { status: 'submitting' } | { status: 'error'; error: string }
}

type ChatAction =
  | { type: 'SYNC_STARTED' }
  | { type: 'SYNC_SUCCEEDED'; messages: ChatMessage[] }
  | { type: 'SYNC_FAILED'; error: string }
  | { type: 'POLL_SUCCEEDED'; messages: ChatMessage[] }
  | { type: 'LOAD_OLDER_STARTED' }
  | { type: 'LOAD_OLDER_SUCCEEDED'; messages: ChatMessage[] }
  | { type: 'LOAD_OLDER_FAILED'; error: string }
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_SUCCEEDED'; message: ChatMessage }
  | { type: 'SUBMIT_FAILED'; error: string }
  | { type: 'SUBMIT_VALIDATION_FAILED'; error: string }
  | { type: 'DRAFT_CHANGED' }

const INITIAL_STATE: ChatState = {
  messages: [],
  hasOlderMessages: false,
  statusMessage: 'Loading messages.',
  feed: { status: 'loading' },
  pagination: { status: 'idle' },
  submission: { status: 'idle' }
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SYNC_STARTED':
      return {
        ...state,
        feed: { status: 'loading' },
        pagination: { status: 'idle' },
        statusMessage: 'Loading messages.'
      }

    case 'SYNC_SUCCEEDED': {
      const count = action.messages.length
      return {
        ...state,
        messages: action.messages,
        hasOlderMessages: count === CHAT_LIMITS.defaultMessagesLimit,
        feed: { status: 'idle' },
        statusMessage:
          count > 0
            ? `${count} ${pluralize(count, 'message', 'messages')} loaded.`
            : 'No messages are available yet.'
      }
    }

    case 'SYNC_FAILED':
      return {
        ...state,
        feed: { status: 'error', error: action.error },
        statusMessage: action.error
      }

    case 'POLL_SUCCEEDED': {
      if (action.messages.length === 0) {
        return state
      }

      const merged = mergeChatMessages(state.messages, action.messages)
      const newCount = merged.length - state.messages.length

      if (newCount === 0) {
        return state
      }

      return {
        ...state,
        messages: merged,
        statusMessage: `${newCount} new ${pluralize(newCount, 'message', 'messages')} received.`
      }
    }

    case 'LOAD_OLDER_STARTED':
      return {
        ...state,
        pagination: { status: 'loading' }
      }

    case 'LOAD_OLDER_SUCCEEDED': {
      const count = action.messages.length
      return {
        ...state,
        messages: mergeChatMessages(state.messages, action.messages),
        hasOlderMessages: count === CHAT_LIMITS.defaultMessagesLimit,
        pagination: { status: 'idle' },
        statusMessage:
          count > 0
            ? `${count} older messages loaded.`
            : 'No older messages are available.'
      }
    }

    case 'LOAD_OLDER_FAILED':
      return {
        ...state,
        pagination: { status: 'error', error: action.error },
        statusMessage: action.error
      }

    case 'SUBMIT_STARTED':
      return {
        ...state,
        submission: { status: 'submitting' },
        statusMessage: 'Sending message.'
      }

    case 'SUBMIT_SUCCEEDED':
      return {
        ...state,
        messages: upsertChatMessage(state.messages, action.message),
        submission: { status: 'idle' },
        statusMessage: 'Message sent.'
      }

    case 'SUBMIT_FAILED':
      return {
        ...state,
        submission: { status: 'error', error: action.error },
        statusMessage: action.error
      }

    case 'SUBMIT_VALIDATION_FAILED':
      return {
        ...state,
        submission: { status: 'error', error: action.error }
      }

    case 'DRAFT_CHANGED':
      if (state.submission.status === 'error') {
        return { ...state, submission: { status: 'idle' } }
      }
      return state
  }
}

// -- Hook --

export function useChatState() {
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)
  const [draft, setDraft] = useState<CreateMessageInput>(INITIAL_DRAFT)
  const syncEpochRef = useRef(0)
  const pollAbortControllerRef = useRef<AbortController | null>(null)
  const isPollingRef = useRef(false)
  const stateRef = useRef(state)
  const draftRef = useRef(draft)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    draftRef.current = draft
  }, [draft])

  const syncMessages = useCallback(async (signal?: AbortSignal) => {
    const epoch = ++syncEpochRef.current
    dispatch({ type: 'SYNC_STARTED' })

    for (let attempt = 0; attempt <= INITIAL_SYNC_RETRY_LIMIT; attempt += 1) {
      try {
        const messages = await chatApi.listMessages(createLatestMessagesQuery(), { signal })
        const isStale = signal?.aborted || syncEpochRef.current !== epoch

        if (!isStale) {
          dispatch({ type: 'SYNC_SUCCEEDED', messages })
        }

        return
      } catch (error) {
        const isStale = signal?.aborted || syncEpochRef.current !== epoch

        if (isStale) {
          return
        }

        const canRetry =
          attempt < INITIAL_SYNC_RETRY_LIMIT && shouldRetryInitialSync(error)

        if (canRetry) {
          try {
            await waitForRetry(INITIAL_SYNC_RETRY_DELAY_MS, signal)
            continue
          } catch {
            return
          }
        }

        dispatch({ type: 'SYNC_FAILED', error: toErrorMessage(error) })
        return
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    void syncMessages(controller.signal)

    return () => {
      controller.abort()
    }
  }, [syncMessages])

  const pollForNewMessages = useCallback(async () => {
    const currentState = stateRef.current

    if (
      typeof document !== 'undefined' &&
      document.hidden
    ) {
      return
    }

    if (
      isPollingRef.current ||
      currentState.feed.status !== 'idle' ||
      currentState.pagination.status === 'loading' ||
      currentState.messages.length === 0
    ) {
      return
    }

    const newestMessage = currentState.messages[currentState.messages.length - 1]
    const controller = new AbortController()

    pollAbortControllerRef.current = controller
    isPollingRef.current = true

    try {
      const newMessages = await chatApi.listMessages({
        after: newestMessage.createdAt,
        limit: CHAT_LIMITS.defaultMessagesLimit
      }, {
        signal: controller.signal
      })

      if (!controller.signal.aborted && newMessages.length > 0) {
        dispatch({ type: 'POLL_SUCCEEDED', messages: newMessages })
      }
    } catch {
      // Background polling fails silently to avoid disrupting the user
    } finally {
      if (pollAbortControllerRef.current === controller) {
        pollAbortControllerRef.current = null
      }

      isPollingRef.current = false
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      void pollForNewMessages()
    }, CHAT_LIMITS.pollIntervalMs)

    return () => {
      clearInterval(interval)
      pollAbortControllerRef.current?.abort()
    }
  }, [pollForNewMessages])

  const updateAuthor = useCallback((author: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, author }))
    dispatch({ type: 'DRAFT_CHANGED' })
  }, [])

  const updateMessage = useCallback((message: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, message }))
    dispatch({ type: 'DRAFT_CHANGED' })
  }, [])

  const submitMessage = useCallback(async () => {
    if (stateRef.current.submission.status === 'submitting') {
      return
    }

    const currentDraft = draftRef.current
    const validationError = validateDraft(currentDraft)

    if (validationError) {
      dispatch({ type: 'SUBMIT_VALIDATION_FAILED', error: validationError })
      return
    }

    syncEpochRef.current++
    dispatch({ type: 'SUBMIT_STARTED' })

    try {
      const trimmedAuthor = currentDraft.author.trim()
      const createdMessage = await chatApi.createMessage(currentDraft)
      dispatch({ type: 'SUBMIT_SUCCEEDED', message: createdMessage })
      setDraft({ author: trimmedAuthor, message: '' })
    } catch (error) {
      dispatch({ type: 'SUBMIT_FAILED', error: toErrorMessage(error) })
    }
  }, [])

  const loadOlderMessages = useCallback(async () => {
    const currentState = stateRef.current
    const oldestMessage = currentState.messages[0]

    if (
      !oldestMessage ||
      currentState.feed.status === 'loading' ||
      currentState.pagination.status === 'loading'
    ) {
      return
    }

    dispatch({ type: 'LOAD_OLDER_STARTED' })

    try {
      const olderMessages = await chatApi.listMessages({
        before: oldestMessage.createdAt,
        limit: CHAT_LIMITS.defaultMessagesLimit
      })

      dispatch({ type: 'LOAD_OLDER_SUCCEEDED', messages: olderMessages })
    } catch (error) {
      dispatch({ type: 'LOAD_OLDER_FAILED', error: toErrorMessage(error) })
    }
  }, [])

  const retryMessages = useCallback(async () => {
    await syncMessages()
  }, [syncMessages])

  return {
    author: draft.author,
    message: draft.message,
    messages: state.messages,
    hasOlderMessages: state.hasOlderMessages,
    isLoading: state.feed.status === 'loading',
    isLoadingOlder: state.pagination.status === 'loading',
    isSubmitting: state.submission.status === 'submitting',
    loadError: state.feed.status === 'error' ? state.feed.error : null,
    loadOlderError: state.pagination.status === 'error' ? state.pagination.error : null,
    submitError: state.submission.status === 'error' ? state.submission.error : null,
    statusMessage: state.statusMessage,
    loadOlderMessages,
    updateAuthor,
    updateMessage,
    retryMessages,
    submitMessage
  }
}
