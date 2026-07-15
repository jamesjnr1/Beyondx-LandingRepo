import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from './auth/AuthContext'

const links = [
  { label: 'Home', href: '#top' },
  { label: 'Meet the Team', href: '#team' },
  { label: 'Gallery', href: '#gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { open: openAuth } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dark = !scrolled

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? 'bg-cream-50/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top">
          <Logo tone={dark ? 'light' : 'dark'} />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`group relative text-sm font-medium transition-colors ${
                dark ? 'text-cream-200/90 hover:text-cream-50' : 'text-ink-700 hover:text-forest-600'
              }`}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-clay-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => openAuth('worker-login')}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
              dark
                ? 'border-cream-50/30 text-cream-50 hover:bg-cream-50/10'
                : 'border-ink-900/15 text-ink-800 hover:bg-ink-900/5'
            }`}
          >
            Worker Login
          </button>
          <button
            onClick={() => openAuth('employer-login')}
            className="rounded-full bg-forest-600 px-5 py-2 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:bg-forest-500 active:scale-[0.97]"
          >
            Employer Login
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`rounded-lg p-2 md:hidden ${dark ? 'text-cream-50' : 'text-ink-900'}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-cream-50/95 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-forest-600/5 hover:text-forest-600"
                >
                  {l.label}
                </a>
              ))}
              <button
                onClick={() => { setOpen(false); openAuth('worker-login') }}
                className="mt-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-center text-sm font-medium text-ink-800 transition-colors hover:bg-ink-900/5"
              >
                Worker Login
              </button>
              <button
                onClick={() => { setOpen(false); openAuth('employer-login') }}
                className="rounded-full bg-forest-600 px-5 py-2.5 text-center text-sm font-semibold text-cream-50"
              >
                Employer Login
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
