import { useEffect, useState, type ReactNode, type FormEvent, type InputHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import Logo from '../Logo'
import { useAuth, type AuthView } from './AuthContext'

/**
 * The real BeyondX platform (accounts, dispatch, dashboards) lives at the app
 * below. These landing-page forms collect the same fields as the main site and
 * hand off to the platform to complete sign-in / registration.
 */
const APP_URL = 'https://beyondxco.com'
const goToApp = () => {
  window.location.href = APP_URL
}

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
  'Northern', 'Volta', 'Upper East', 'Upper West', 'Brong-Ahafo',
]
const FACILITIES = [
  'Prefer not to say / Not applicable', 'Nsawam Medium Security Prison',
  'Kumasi Central Prison', 'James Fort Prison', 'Ankaful Maximum Security Prison',
  'Sunyani Central Prison', 'Ho Central Prison', 'Tamale Central Prison',
]
const SKILLS = [
  'Facility & Cleaning', 'Logistics & Delivery', 'Maintenance & Repairs',
  'Event & Hospitality', 'Agriculture & Environment', 'Retail & Trade',
  'Community Services', 'Other',
]
const RELATIONSHIPS = [
  'Family Member', 'Friend', 'Former Employer',
  'Community/Religious Leader', 'Case Worker / Social Worker', 'Other',
]

/* ---------- shared UI ---------- */

function Modal({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { close } = useAuth()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [close])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={close}
    >
      <div
        className="relative my-8 w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900"
        >
          <X size={20} />
        </button>
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo tone="dark" className="h-8" />
          <h2 className="mt-4 font-serif text-2xl font-medium text-ink-900">{title}</h2>
          <p className="mt-1 text-sm text-ink-700">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, ...rest
}: {
  label: string
  value: string
  onChange: (v: string) => void
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none transition-colors placeholder:text-ink-700/40 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
        {...rest}
      />
    </label>
  )
}

function Select({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink-900/15 bg-white px-4 py-2.5 text-ink-900 outline-none transition-colors focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}

function Submit({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:bg-forest-500"
    >
      {children}
    </button>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-3 mt-2 text-xs font-semibold uppercase tracking-widest text-forest-700">{children}</p>
}

function SwitchLink({ prompt, action, to }: { prompt: string; action: string; to: AuthView }) {
  const { open } = useAuth()
  return (
    <p className="mt-5 text-center text-sm text-ink-700">
      {prompt}{' '}
      <button onClick={() => open(to)} className="font-semibold text-forest-600 hover:text-forest-500">
        {action}
      </button>
    </p>
  )
}

/* ---------- forms ---------- */

function WorkerLogin() {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); goToApp() }
  return (
    <Modal title="Worker Login" subtitle="Access your BeyondX task dashboard">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Phone Number" type="tel" placeholder="0XX XXX XXXX" value={phone} onChange={setPhone} />
        <Field label="PIN" type="password" inputMode="numeric" placeholder="••••" value={pin} onChange={setPin} />
        <Submit>Sign In to My Dashboard</Submit>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-ink-700/50">
        <span className="h-px flex-1 bg-ink-900/10" /> or <span className="h-px flex-1 bg-ink-900/10" />
      </div>
      <SwitchLink prompt="New to BeyondX?" action="Register as a Worker" to="worker-register" />
    </Modal>
  )
}

function EmployerLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); goToApp() }
  return (
    <Modal title="Employer Login" subtitle="Sign in to access the worker dispatch platform">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        <Submit>Sign In</Submit>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-ink-700/50">
        <span className="h-px flex-1 bg-ink-900/10" /> or <span className="h-px flex-1 bg-ink-900/10" />
      </div>
      <SwitchLink prompt="Don't have an account?" action="Create Employer Account" to="employer-register" />
    </Modal>
  )
}

function EmployerRegister() {
  const [f, setF] = useState({ org: '', contact: '', phone: '', region: REGIONS[0], email: '', password: '' })
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v })
  const submit = (e: FormEvent) => { e.preventDefault(); goToApp() }
  return (
    <Modal title="Create Employer Account" subtitle="Join BeyondX and start hiring verified workers">
      <form onSubmit={submit} className="space-y-4">
        <SectionLabel>Organisation Details</SectionLabel>
        <Field label="Organisation Name" value={f.org} onChange={set('org')} />
        <Field label="Contact Person" value={f.contact} onChange={set('contact')} />
        <Field label="Phone Number" type="tel" value={f.phone} onChange={set('phone')} />
        <Select label="Region" options={REGIONS} value={f.region} onChange={set('region')} />
        <SectionLabel>Account Security</SectionLabel>
        <Field label="Email Address" type="email" value={f.email} onChange={set('email')} />
        <Field label="Password" type="password" value={f.password} onChange={set('password')} />
        <Submit>Create Account</Submit>
      </form>
      <SwitchLink prompt="Already have an account?" action="Sign In" to="employer-login" />
    </Modal>
  )
}

function WorkerRegister() {
  const [f, setF] = useState({
    name: '', phone: '', ghanaCard: '', facility: FACILITIES[0],
    gName: '', gPhone: '', relationship: RELATIONSHIPS[0], pin: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v })
  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
  const submit = (e: FormEvent) => { e.preventDefault(); goToApp() }
  return (
    <Modal title="Register as a Worker" subtitle="Join BeyondX and start earning through verified work">
      <form onSubmit={submit} className="space-y-4">
        <SectionLabel>Personal Details</SectionLabel>
        <Field label="Full Name" value={f.name} onChange={set('name')} />
        <Field label="Phone Number" type="tel" value={f.phone} onChange={set('phone')} />
        <Field label="Ghana Card Number" placeholder="GHA-XXXXXXXXX-X" maxLength={15} value={f.ghanaCard} onChange={set('ghanaCard')} />
        <Select label="Prison Facility (optional)" options={FACILITIES} value={f.facility} onChange={set('facility')} />

        <div>
          <SectionLabel>Your Skills</SectionLabel>
          <p className="-mt-2 mb-2 text-xs text-ink-700">Select all that apply</p>
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map((s) => {
              const active = skills.includes(s)
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSkill(s)}
                  className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                    active
                      ? 'border-forest-600 bg-forest-600/10 text-forest-700'
                      : 'border-ink-900/15 text-ink-700 hover:border-forest-500/50'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        <SectionLabel>Guarantor Information</SectionLabel>
        <Field label="Guarantor Full Name" value={f.gName} onChange={set('gName')} />
        <Field label="Guarantor Phone Number" type="tel" value={f.gPhone} onChange={set('gPhone')} />
        <Select label="Relationship to Guarantor" options={RELATIONSHIPS} value={f.relationship} onChange={set('relationship')} />

        <SectionLabel>Security</SectionLabel>
        <Field label="PIN (4 digits)" type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={f.pin} onChange={set('pin')} />

        <Submit>Create My Account</Submit>
      </form>
      <SwitchLink prompt="Already have an account?" action="Sign In" to="worker-login" />
    </Modal>
  )
}

export default function AuthModals() {
  const { view } = useAuth()
  if (!view) return null
  if (view === 'worker-login') return <WorkerLogin />
  if (view === 'employer-login') return <EmployerLogin />
  if (view === 'employer-register') return <EmployerRegister />
  if (view === 'worker-register') return <WorkerRegister />
  return null
}
