import { createContext, useContext, useState, type ReactNode } from 'react'

export type AuthView =
  | 'worker-login'
  | 'employer-login'
  | 'worker-register'
  | 'employer-register'
  | null

type AuthCtx = {
  view: AuthView
  open: (v: AuthView) => void
  close: () => void
}

const Ctx = createContext<AuthCtx>({ view: null, open: () => {}, close: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AuthView>(null)
  return (
    <Ctx.Provider value={{ view, open: setView, close: () => setView(null) }}>
      {children}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(Ctx)
