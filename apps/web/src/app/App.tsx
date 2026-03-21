import { AppShell } from '../components/layout/AppShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ChatScreen } from '../features/chat/components/ChatScreen'
import type { ShellCopy } from '../types/app'

const shellCopy: ShellCopy = {
  eyebrow: 'Checkpoint 01',
  title: 'Frontend architecture scaffold',
  description:
    'This checkpoint stops before product behavior and locks the structure, ownership boundaries, and documentation strategy for the chat interface.'
}

export function App() {
  useDocumentTitle('Doodle Chat Challenge')

  return (
    <AppShell copy={shellCopy}>
      <ChatScreen />
    </AppShell>
  )
}
