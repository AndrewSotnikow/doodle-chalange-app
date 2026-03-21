import type { PropsWithChildren } from 'react'
import type { ShellCopy } from '../../types/app'

interface AppShellProps extends PropsWithChildren {
  copy: ShellCopy
}

export function AppShell({ children, copy }: AppShellProps) {
  return (
    <div className="app-shell">
      <main className="app-shell__content">
        <section className="hero-card">
          <p className="hero-card__eyebrow">{copy.eyebrow}</p>
          <h1 className="hero-card__title">{copy.title}</h1>
          <p className="hero-card__description">{copy.description}</p>
        </section>
        {children}
      </main>
    </div>
  )
}
