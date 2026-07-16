import { LogOut, UserRound } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../components/auth/AuthContext'

export default function DashboardHeader({
  role, title, name, avatar, onEditProfile,
}: {
  role: 'WORKER' | 'EMPLOYER'
  title: string
  name?: string
  avatar?: string
  onEditProfile?: () => void
}) {
  const { go } = useAuth()
  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-cream-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <button onClick={() => go('home')} aria-label="Go to BeyondX home" className="shrink-0">
          <Logo tone="dark" className="h-7 sm:h-8" />
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden rounded-full bg-forest-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-forest-700 sm:inline">
            {role} · VERIFIED
          </span>
          {onEditProfile && (
            <button onClick={onEditProfile} aria-label="Edit your profile"
              className="flex items-center gap-2 rounded-full border border-ink-900/15 py-1 pl-1 pr-3.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-900/5 active:scale-[0.98]">
              {avatar
                ? <img src={avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                : <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-600 text-cream-50"><UserRound size={15} /></span>}
              <span className="hidden sm:inline">{name ? name.split(' ')[0] : 'Profile'}</span>
            </button>
          )}
          <button onClick={() => go('home')} aria-label="Log out and return home"
            className="flex items-center gap-1.5 rounded-full border border-ink-900/15 px-3.5 py-1.5 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-900/5 active:scale-[0.98]">
            <LogOut size={15} aria-hidden="true" /> <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-4 pt-1 sm:px-8">
        <h1 className="font-serif text-2xl font-medium text-ink-900 sm:text-3xl">{title}</h1>
      </div>
    </header>
  )
}
