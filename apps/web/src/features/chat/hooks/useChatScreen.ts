import { useChatState } from './useChatState'

export function useChatScreen() {
  const chatState = useChatState()

  return {
    activeAuthor: chatState.author.trim(),
    messageCount: chatState.messages.length,
    ...chatState
  }
}
