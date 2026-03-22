import { AppShell } from '../components/layout/AppShell'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ChatScreen } from '../features/chat/components/ChatScreen'

export function App() {
  useDocumentTitle('Doodle Chat Challenge')

  return (
    <AppShell>
      <ChatScreen />
    </AppShell>
  )
}
