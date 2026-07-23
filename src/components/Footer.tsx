import { Instagram, Linkedin, Music2, Twitter, Mail } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from './auth/AuthContext'

const socials = [
  { icon: Instagram, href: 'https://instagram.com/beyondx26', label: 'Instagram' },
  { icon: Music2, href: 'https://www.tiktok.com/@beyondx26', label: 'TikTok' },
  { icon: Twitter, href: 'https://x.com/beyondx26', label: 'X' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/beyondx', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:beyondx26@gmail.com', label: 'Email' },
]

export default function Footer() {
  const { go, open } = useAuth()
  const linkCls = 'text-left transition-colors hover:text-forest-600'

  return (
    <footer className="border-t border-ink-900/8 bg-cream-100 py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo tone="dark" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-700/70 text-pretty">
              Connecting verified, skill-matched workers rebuilding their lives
              with employers across Greater Accra.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="rounded-lg border border-ink-900/10 p-2 text-ink-700 transition-colors hover:bg-forest-600/5 hover:text-forest-600">
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-700/60">TikTok · IG · X: @beyondx26 · LinkedIn: Beyond X</p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink-900">Pages</h4>
            <ul className="space-y-2.5 text-sm text-ink-700/70">
              <li><button onClick={() => go('home')} className={linkCls}>Home</button></li>
              <li><button onClick={() => go('team')} className={linkCls}>Meet the Team</button></li>
              <li><button onClick={() => go('gallery')} className={linkCls}>Gallery</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink-900">Access</h4>
            <ul className="space-y-2.5 text-sm text-ink-700/70">
              <li><button onClick={() => open('employer-login')} className={linkCls}>Hire a worker</button></li>
              <li><button onClick={() => open('worker-login')} className={linkCls}>Find work</button></li>
              <li><button onClick={() => open('worker-login')} className={linkCls}>Worker Login</button></li>
              <li><button onClick={() => open('employer-login')} className={linkCls}>Employer Login</button></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink-900">Contact</h4>
            <ul className="space-y-2.5 text-sm text-ink-700/70">
              <li>Greater Accra, Ghana</li>
              <li><a href="mailto:beyondx26@gmail.com" className="transition-colors hover:text-forest-600">beyondx26@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-900/8 pt-6">
          <p className="text-xs leading-relaxed text-ink-700/60 text-pretty">
            All individuals listed on this platform are participants in
            BeyondX's second-chance employment programme, vetted directly by our
            team. © {new Date().getFullYear()} BeyondX. Go Beyond. Hire Purpose.
          </p>
        </div>
      </div>
    </footer>
  )
}
