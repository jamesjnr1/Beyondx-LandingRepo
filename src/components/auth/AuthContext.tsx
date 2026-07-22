import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { session } from '../../lib/api'

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
  logout: () => void
}

const Ctx = createContext<AppCtx>({
  view: null, open: () => {}, close: () => {}, page: 'home', go: () => {}, logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView>(null)
  const [page, setPage] = useState<Page>('home')

  // Keep people signed in across refreshes, using the same session the main site sets.
  useEffect(() => {
    if (session.workerToken()) setPage('worker-dashboard')
    else if (session.employerToken()) setPage('employer-dashboard')
  }, [])

  const logout = () => {
    if (page === 'worker-dashboard') session.logoutWorker()
    if (page === 'employer-dashboard') session.logoutEmployer()
    setView(null)
    setPage('home')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const go = (p: Page) => {
    setView(null)
    setPage(p)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <Ctx.Provider value={{ view, open: setView, close: () => setView(null), page, go, logout }}>
      {children}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx)
