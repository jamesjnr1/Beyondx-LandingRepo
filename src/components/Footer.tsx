import { Instagram, Linkedin, Mail } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
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
            <div className="mt-5 flex items-center gap-3">
              <a href="#" className="rounded-lg border border-ink-900/10 p-2 text-ink-700 transition-colors hover:bg-forest-600/5 hover:text-forest-600">
                <Instagram size={18} />
              </a>
              <a href="#" className="rounded-lg border border-ink-900/10 p-2 text-ink-700 transition-colors hover:bg-forest-600/5 hover:text-forest-600">
                <Linkedin size={18} />
              </a>
              <a href="#" className="rounded-lg border border-ink-900/10 p-2 text-ink-700 transition-colors hover:bg-forest-600/5 hover:text-forest-600">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink-900">Pages</h4>
            <ul className="space-y-2.5 text-sm text-ink-700/70">
              <li><a href="#how" className="transition-colors hover:text-forest-600">How it works</a></li>
              <li><a href="#workers" className="transition-colors hover:text-forest-600">Workers</a></li>
              <li><a href="#principles" className="transition-colors hover:text-forest-600">Principles</a></li>
              <li><a href="#gallery" className="transition-colors hover:text-forest-600">Gallery</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink-900">Services</h4>
            <ul className="space-y-2.5 text-sm text-ink-700/70">
              <li><a href="#" className="transition-colors hover:text-forest-600">Hire a worker</a></li>
              <li><a href="#" className="transition-colors hover:text-forest-600">Find work</a></li>
              <li><a href="#" className="transition-colors hover:text-forest-600">Partner with us</a></li>
              <li><a href="#" className="transition-colors hover:text-forest-600">Sign in</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-ink-900">Contact</h4>
            <ul className="space-y-2.5 text-sm text-ink-700/70">
              <li>Greater Accra, Ghana</li>
              <li><a href="mailto:hello@beyondx.gh" className="transition-colors hover:text-forest-600">hello@beyondx.gh</a></li>
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
