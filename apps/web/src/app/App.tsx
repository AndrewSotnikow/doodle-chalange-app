import { AppShell } from '../components/layout/AppShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ChatScreen } from '../features/chat/components/ChatScreen'
import type { ShellCopy } from '../types/app'

const shellCopy: ShellCopy = {
  eyebrow: 'Checkpoint 03',
  title: 'Focused chat interface',
  description:
    'This checkpoint turns the data layer into a usable chat experience with focused UI components and clear state-driven rendering.'
}

export function App() {
  useDocumentTitle('Doodle Chat Challenge')

  return (
    <AppShell copy={shellCopy}>
      <ChatScreen />
    </AppShell>
  )
}
