import { createContext, useContext, useState, type ReactNode } from 'react'

export type AuthView =
  | 'worker-login'
  | 'employer-login'
  | 'worker-register'
  | 'employer-register'
  | 'worker-onboarding'
  | 'employer-onboarding'
  | null

export type Page = 'home' | 'team' | 'gallery' | 'worker-dashboard' | 'employer-dashboard'

type AppCtx = {
  view: AuthView
  open: (v: AuthView) => void
  close: () => void
  page: Page
  go: (p: Page) => void
}

const Ctx = createContext<AppCtx>({
  view: null, open: () => {}, close: () => {}, page: 'home', go: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView>(null)
  const [page, setPage] = useState<Page>('home')

  const go = (p: Page) => {
    setView(null)
    setPage(p)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <Ctx.Provider value={{ view, open: setView, close: () => setView(null), page, go }}>
      {children}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx)
