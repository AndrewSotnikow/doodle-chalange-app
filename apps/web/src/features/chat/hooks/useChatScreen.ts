import type { ArchitectureNote } from '../../../types/app'
import type { ChatPreviewMessage } from '../types/chat'

const notes: ArchitectureNote[] = [
  {
    title: 'UI components stay narrow',
    description:
      'Components are limited to rendering and local interaction, which keeps the next phase easier to test and extend.'
  },
  {
    title: 'Hooks own orchestration',
    description:
      'Feature hooks become the seam between rendering and business rules, instead of letting request logic spread through the tree.'
  },
  {
    title: 'Services own IO',
    description:
      'The API layer is already carved out so message fetching and submission can land without reshaping the UI.'
  }
]

const previewMessages: ChatPreviewMessage[] = [
  {
    id: 'message-1',
    author: 'System',
    message: 'Repo structure and documentation are in place.',
    timestampLabel: 'Checkpoint',
    variant: 'system'
  },
  {
    id: 'message-2',
    author: 'Frontend',
    message: 'The message list component is ready for real data once the API layer is connected.',
    timestampLabel: 'Preview',
    variant: 'incoming'
  },
  {
    id: 'message-3',
    author: 'Composer',
    message: 'The input area is intentionally disabled until submission flow is implemented.',
    timestampLabel: 'Next step',
    variant: 'outgoing'
  }
]

export function useChatScreen() {
  return {
    notes,
    previewMessages
  }
}
