import { AppShell } from '../components/layout/AppShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ChatScreen } from '../features/chat/components/ChatScreen'
import type { ShellCopy } from '../types/app'

const shellCopy: ShellCopy = {
  eyebrow: 'Checkpoint 02',
  title: 'Typed API and state layer',
  description:
    'This checkpoint adds a typed service layer and dedicated state orchestration while keeping the UI free from direct network concerns.'
}

export function App() {
  useDocumentTitle('Doodle Chat Challenge')

  return (
    <AppShell copy={shellCopy}>
      <ChatScreen />
    </AppShell>
  )
}
