import type { ArchitectureNote } from '../../../types/app'
import { useChatState } from './useChatState'

const notes: ArchitectureNote[] = [
  {
    title: 'Typed API client',
    description:
      'The service layer owns request construction, response parsing, and transport-level error handling.'
  },
  {
    title: 'Message normalization',
    description:
      'Backend payloads are mapped into a frontend message model so UI code never deals with API-specific field names.'
  },
  {
    title: 'Hook-driven orchestration',
    description:
      'Fetching, submission state, and retry behavior live in a dedicated hook, leaving the components as render-only surfaces.'
  }
]

export function useChatScreen() {
  const chatState = useChatState()

  return {
    notes,
    ...chatState
  }
}
