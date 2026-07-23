import { useEffect, useState, type ReactNode, type FormEvent, type InputHTMLAttributes } from 'react'
import { X, ShieldCheck, ChevronLeft } from 'lucide-react'
import Logo from '../Logo'
import { useAuth, type AuthView } from './AuthContext'
import { auth, session, referral, ApiError } from '../../lib/api'
import OnboardingQuestions from './OnboardingQuestions'
import * as v from '../../lib/validate'
import { categories, remoteCategories } from '../../data'

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern',
  'Northern', 'Volta', 'Upper East', 'Upper West', 'Brong-Ahafo',
]
const FACILITIES = [
  'Prefer not to say / Not applicable', 'Nsawam Medium Security Prison',
  'Kumasi Central Prison', 'James Fort Prison', 'Ankaful Maximum Security Prison',
  'Sunyani Central Prison', 'Ho Central Prison', 'Tamale Central Prison',
]
const FIELD_SKILLS = categories.map((c) => c.title)
const REMOTE_SKILLS = remoteCategories.map((c) => c.title)
const RELATIONSHIPS = [
  'Family Member', 'Friend', 'Former Employer',
  'Community/Religious Leader', 'Case Worker / Social Worker', 'Other',
]

function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-relaxed text-red-700">
      {message}
    </p>
  )
}

function errText(e: unknown) {
  if (e instanceof ApiError) return e.message
  return 'Something went wrong. Please try again.'
}

function Modal({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const { close } = useAuth()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [close])

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink-950/60 p-4 backdrop-blur-sm sm:items-center" onClick={close}>
      <div role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" className="relative my-4 w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-2xl sm:my-8 sm:p-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full p-1.5 text-ink-700 transition-colors hover:bg-ink-900/5 hover:text-ink-900">
          <X size={20} aria-hidden="true" />
        </button>
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo tone="dark" className="h-8" />
          <h2 id="auth-modal-title" className="mt-4 font-serif text-2xl font-medium text-ink-900">{title}</h2>
          <p className="mt-1 text-sm text-ink-700">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, error, ...rest }: { label: string; value: string; onChange: (v: string) => void; error?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const id = `f-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-800">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink-900 outline-none transition-colors placeholder:text-ink-700/40 focus:ring-2 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-ink-900/15 focus:border-forest-500 focus:ring-forest-500/20'}`}
        {...rest}
      />
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  )
}

function Select({ label, options, value, onChange, error, placeholder }: { label: string; options: string[]; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  const id = `s-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
  return (
    <div className="block">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-800">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-ink-900 outline-none transition-colors focus:ring-2 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-ink-900/15 focus:border-forest-500 focus:ring-forest-500/20'}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  )
}

function Submit({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return <button type="submit" disabled={disabled} className="w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-70">{children}</button>
}

function SwitchLink({ prompt, action, to }: { prompt: string; action: string; to: AuthView }) {
  const { open } = useAuth()
  return (
    <p className="mt-5 text-center text-sm text-ink-700">
      {prompt}{' '}
      <button onClick={() => open(to)} className="font-semibold text-forest-600 hover:text-forest-500">{action}</button>
    </p>
  )
}

function Divider() {
  return <div className="my-4 flex items-center gap-3 text-xs text-ink-700/50"><span className="h-px flex-1 bg-ink-900/10" /> or <span className="h-px flex-1 bg-ink-900/10" /></div>
}

function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-700">
        <span>Step {step} of {total}</span><span>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/10">
        <div className="h-full rounded-full bg-forest-600 transition-all duration-300" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  )
}

function WorkerLogin() {
  const { go } = useAuth()
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setErr(null); setBusy(true)
    try {
      const data = await auth.workerLogin(phone.trim(), pin.trim())
      session.saveWorker(data.token, data.worker)
      go('worker-dashboard')
    } catch (e2) {
      setErr(errText(e2))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Worker Login" subtitle="Access your BeyondX task dashboard">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Phone Number" type="tel" placeholder="0XX XXX XXXX" value={phone} onChange={setPhone} />
        <Field label="PIN" type="password" inputMode="numeric" placeholder="••••" value={pin} onChange={setPin} />
        <FormError message={err} />
        <Submit disabled={busy}>{busy ? 'Signing in…' : 'Sign In to My Dashboard'}</Submit>
      </form>
      <Divider />
      <SwitchLink prompt="New to BeyondX?" action="Register as a Worker" to="worker-register" />
    </Modal>
  )
}

function EmployerLogin() {
  const { go } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setErr(null); setBusy(true)
    try {
      const data = await auth.employerLogin(email.trim(), password)
      session.saveEmployer(data.token, data.employer)
      go('employer-dashboard')
    } catch (e2) {
      setErr(errText(e2))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title="Employer Login" subtitle="Sign in to access the worker dispatch platform">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={setEmail} />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
        <FormError message={err} />
        <Submit disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</Submit>
      </form>
      <Divider />
      <SwitchLink prompt="Don't have an account?" action="Create Employer Account" to="employer-register" />
    </Modal>
  )
}

function EmployerRegister() {
  const { open } = useAuth()
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ org: '', contact: '', phone: '', region: '', email: '', password: '' })
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({})
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const validateStep = (n: number) => {
    const errs = n === 1
      ? v.check({ org: v.orgName(f.org), contact: v.fullName(f.contact), phone: v.phone(f.phone), region: v.required('Region')(f.region) })
      : v.check({ email: v.email(f.email), password: v.password(f.password) })
    setFieldErr(errs)
    return Object.keys(errs).length === 0
  }

  const next = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return
    if (step < 2) { setStep(step + 1); return }
    if (busy) return
    setErr(null); setBusy(true)
    try {
      const data = await auth.employerRegister({
        email: f.email.trim(), password: f.password, orgName: f.org.trim(),
        contactPerson: f.contact.trim(), phone: f.phone.trim(), region: f.region,
      })
      session.saveEmployer(data.token, data.employer)
      open('employer-onboarding')
    } catch (e2) {
      setErr(errText(e2))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal title="Create Employer Account" subtitle="Join BeyondX and start hiring verified workers">
      <Stepper step={step} total={2} />
      <form onSubmit={next} className="space-y-4">
        {step === 1 && (<>
          <Field label="Organisation Name" value={f.org} onChange={set('org')} error={fieldErr.org} />
          <Field label="Contact Person" value={f.contact} onChange={set('contact')} error={fieldErr.contact} />
          <Field label="Phone Number" type="tel" placeholder="0241234567" value={f.phone} onChange={set('phone')} error={fieldErr.phone} />
          <Select label="Region" options={REGIONS} placeholder="Select a region" value={f.region} onChange={set('region')} error={fieldErr.region} />
        </>)}
        {step === 2 && (<>
          <Field label="Email Address" type="email" placeholder="you@company.com" value={f.email} onChange={set('email')} error={fieldErr.email} />
          <Field label="Password" type="password" placeholder="At least 8 characters" value={f.password} onChange={set('password')} error={fieldErr.password} />
        </>)}
        <FormError message={err} />
        <div className="mt-5 flex items-center gap-3">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1 rounded-full border border-ink-900/15 px-4 py-3 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-900/5">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button type="submit" disabled={busy} className="flex-1 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-70">
            {busy ? 'Creating…' : step < 2 ? 'Continue' : 'Create Account'}
          </button>
        </div>
      </form>
      <SwitchLink prompt="Already have an account?" action="Sign In" to="employer-login" />
    </Modal>
  )
}

function WorkerRegister() {
  const { open } = useAuth()
  const [step, setStep] = useState(1)
  const [f, setF] = useState({ name: '', phone: '', facility: '', gName: '', gPhone: '', relationship: '', pin: '' })
  // Remote work is not offered on accounts that name a facility.
  const remoteLocked = Boolean(f.facility)
  useEffect(() => {
    if (remoteLocked) setSkills((prev) => prev.filter((sk) => !REMOTE_SKILLS.includes(sk)))
  }, [remoteLocked])
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({})
  const [skills, setSkills] = useState<string[]>([])
  const set = (k: keyof typeof f) => (v: string) => setF({ ...f, [k]: v })
  const toggleSkill = (s: string) => setSkills((c) => (c.includes(s) ? c.filter((x) => x !== s) : [...c, s]))
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const validateStep = (n: number) => {
    if (n === 1) {
      const errs = v.check({ name: v.fullName(f.name), phone: v.phone(f.phone) })
      setFieldErr(errs)
      return Object.keys(errs).length === 0
    }
    if (n === 2) {
      setFieldErr({})
      if (!skills.length) { setErr('Select at least one skill so employers know what you can do.'); return false }
      setErr(null)
      return true
    }
    const errs = v.check({
      gName: v.fullName(f.gName),
      gPhone: v.phone(f.gPhone),
      relationship: v.required('Relationship to guarantor')(f.relationship),
      pin: v.pin(f.pin),
    })
    if (!errs.gPhone && f.gPhone.replace(/[\s-]/g, '') === f.phone.replace(/[\s-]/g, '')) {
      errs.gPhone = 'Your guarantor must have a different number from yours.'
    }
    setFieldErr(errs)
    return Object.keys(errs).length === 0
  }

  const next = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateStep(step)) return
    if (step < 3) { setStep(step + 1); return }
    if (busy) return
    setErr(null); setBusy(true)
    try {
      const base = {
        fullName: f.name.trim(), phone: f.phone.trim(), prisonFacility: f.facility,
        skills, pin: f.pin.trim(), guarantorName: f.gName.trim(),
        guarantorPhone: f.gPhone.trim(), guarantorRelationship: f.relationship,
      }
      const ref = referral.get()
      let data
      if (ref) {
        // Send the referral code, but never let it block a signup: if the
        // backend rejects the extra field, register again without it.
        try {
          data = await auth.workerRegister({ ...base, referredBy: ref })
        } catch (err) {
          if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
            data = await auth.workerRegister(base)
          } else {
            throw err
          }
        }
      } else {
        data = await auth.workerRegister(base)
      }
      session.saveWorker(data.token, data.worker)
      referral.clear()
      open('worker-onboarding')
    } catch (e2) {
      setErr(errText(e2))
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal title="Register as a Worker" subtitle="Join BeyondX and start earning through verified work">
      <Stepper step={step} total={3} />
      <form onSubmit={next} className="space-y-4">
        {step === 1 && (<>
          <Field label="Full Name" value={f.name} onChange={set('name')} error={fieldErr.name} />
          <Field label="Phone Number" type="tel" placeholder="0241234567" value={f.phone} onChange={set('phone')} error={fieldErr.phone} />
          <Select label="Prison Facility (optional)" options={FACILITIES} placeholder="Not applicable" value={f.facility} onChange={set('facility')} />
        </>)}
        {step === 2 && (
          <div>
            <p className="mb-1 text-sm font-medium text-ink-800">Your Skills</p>
            <p className="mb-3 text-xs text-ink-700">Select all that apply</p>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-clay-500">On the field</p>
            <div className="grid grid-cols-2 gap-2">
              {FIELD_SKILLS.map((sk) => {
                const active = skills.includes(sk)
                return (
                  <button type="button" key={sk} onClick={() => toggleSkill(sk)} className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${active ? 'border-forest-600 bg-forest-600/10 text-forest-700' : 'border-ink-900/15 text-ink-700 hover:border-forest-500/50'}`}>
                    {sk}
                  </button>
                )
              })}
            </div>

            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-clay-500">Remote</p>
            {remoteLocked ? (
              <p className="rounded-lg bg-ink-900/5 p-3 text-xs leading-relaxed text-ink-700">
                Remote work isn&rsquo;t open on your account yet. You can take on any of the
                on-the-field work above, and we&rsquo;ll be in touch as more options become available.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {REMOTE_SKILLS.map((sk) => {
                  const active = skills.includes(sk)
                  return (
                    <button type="button" key={sk} onClick={() => toggleSkill(sk)} className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${active ? 'border-forest-600 bg-forest-600/10 text-forest-700' : 'border-ink-900/15 text-ink-700 hover:border-forest-500/50'}`}>
                      {sk}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {step === 3 && (<>
          <Field label="Guarantor Full Name" value={f.gName} onChange={set('gName')} error={fieldErr.gName} />
          <Field label="Guarantor Phone Number" type="tel" placeholder="0241234567" value={f.gPhone} onChange={set('gPhone')} error={fieldErr.gPhone} />
          <Select label="Relationship to Guarantor" options={RELATIONSHIPS} placeholder="Select a relationship" value={f.relationship} onChange={set('relationship')} error={fieldErr.relationship} />
          <Field label="PIN (4 digits)" type="password" inputMode="numeric" maxLength={4} placeholder="••••" value={f.pin} onChange={set('pin')} error={fieldErr.pin} />
        </>)}
        <FormError message={err} />
        <div className="mt-5 flex items-center gap-3">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1 rounded-full border border-ink-900/15 px-4 py-3 text-sm font-medium text-ink-800 transition-colors hover:bg-ink-900/5">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <button type="submit" disabled={busy} className="flex-1 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-70">
            {busy ? 'Creating…' : step < 3 ? 'Continue' : 'Create My Account'}
          </button>
        </div>
      </form>
      <SwitchLink prompt="Already have an account?" action="Sign In" to="worker-login" />
    </Modal>
  )
}

function EmployerOnboarding() {
  const { go } = useAuth()
  const [agreed, setAgreed] = useState(false)
  const [stage, setStage] = useState<'notice' | 'questions'>('notice')

  if (stage === 'questions') {
    return (
      <Modal title="A Few Quick Questions" subtitle="This helps us serve you better">
        <OnboardingQuestions role="employer" onDone={() => go('employer-dashboard')} />
      </Modal>
    )
  }

  return (
    <Modal title="Before You Proceed" subtitle="Important notice regarding our talent pool">
      <div className="space-y-4 text-sm text-ink-700">
        <p>All individuals on this platform are participants in BeyondX's second-chance employment programme, vetted directly by our team.</p>
        <ul className="space-y-2">
          {['Candidates have served their sentences in full and are legally recognised as having fulfilled their debt to society.', 'You are hiring vetted, work-ready individuals assessed as fit for employment.', 'Hiring through this platform may qualify your business for government tax incentives.'].map((t) => (
            <li key={t} className="flex gap-2"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-forest-600" /><span>{t}</span></li>
          ))}
        </ul>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-forest-600/5 p-3">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-forest-600" />
          <span className="text-xs text-ink-800">I have read and understood this notice, and I agree to engage all workers with fairness and human dignity.</span>
        </label>
      </div>
      <button disabled={!agreed} onClick={() => setStage('questions')} className="mt-5 w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 shadow-sm transition-all hover:bg-forest-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
        Continue
      </button>
    </Modal>
  )
}

function WorkerOnboarding() {
  const { go } = useAuth()
  return (
    <Modal title="Before You Begin" subtitle="Welcome. You belong here.">
      <OnboardingQuestions role="worker" onDone={() => go('worker-dashboard')} />
    </Modal>
  )
}

export default function AuthModals() {
  const { view } = useAuth()
  switch (view) {
    case 'worker-login': return <WorkerLogin />
    case 'employer-login': return <EmployerLogin />
    case 'employer-register': return <EmployerRegister />
    case 'worker-register': return <WorkerRegister />
    case 'employer-onboarding': return <EmployerOnboarding />
    case 'worker-onboarding': return <WorkerOnboarding />
    default: return null
  }
}
