import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ChevronRight, Star, Send, Phone, Plus, X, ShieldCheck, CircleCheck, Info, RefreshCw, AlertCircle } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import ProfileModal from '../components/ProfileModal'
import Toast, { type ToastMsg } from '../components/Toast'
import { tasks as tasksApi, workers as workersApi, employers as employersApi, session, ApiError, type Task, type Worker, type Employer } from '../lib/api'

const cedis = (n?: number | string) => `GH\u20b5 ${Number(n || 0).toLocaleString()}`
const wName = (w: Worker) => (w.fullName as string) || (w.name as string) || 'Worker'
const wInitials = (w: Worker) => wName(w).split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
const wSkills = (w: Worker): string[] => (Array.isArray(w.skills) ? (w.skills as string[]) : (w.cats as string[]) || [])
const wCharge = (w: Worker): number => Number((w.dailyCharge as string) ?? (w.charge as number) ?? 0) || 0

const STATUS: Record<string, { label: string; dot: string; chip: string; note?: string }> = {
  open: { label: 'Awaiting worker', dot: 'bg-clay-500', chip: 'bg-clay-400/15 text-clay-600', note: 'Waiting for a worker to accept.' },
  offered: { label: 'Awaiting worker response', dot: 'bg-clay-500', chip: 'bg-clay-400/15 text-clay-600', note: 'The worker will accept or decline shortly.' },
  accepted: { label: 'On the job', dot: 'bg-forest-500', chip: 'bg-forest-600/10 text-forest-700', note: 'Attendance is GPS-verified. Confirm once the work is finished.' },
  pending_confirmation: { label: 'Worker marked done', dot: 'bg-amber-500', chip: 'bg-amber-100 text-amber-700', note: 'Confirm the work to release payment through BeyondX.' },
  employer_confirmed: { label: 'Confirmed — with BeyondX', dot: 'bg-ink-700', chip: 'bg-ink-900/10 text-ink-800', note: 'BeyondX is processing the payment release to the worker.' },
  completed: { label: 'Payment released', dot: 'bg-forest-600', chip: 'bg-forest-600/15 text-forest-800', note: 'BeyondX released the payment to the worker.' },
}
const st = (s?: string) => STATUS[s || 'open'] || STATUS.open

function Stars({ n }: { n: number }) {
  return <span className="inline-flex" role="img" aria-label={`${n} out of 5 stars`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} aria-hidden="true" className={i <= n ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20'} />)}</span>
}
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating out of 5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} star${i > 1 ? 's' : ''}`}
          onClick={() => onChange(i)} className="rounded transition-transform focus:outline-none focus:ring-2 focus:ring-forest-600/40 active:scale-90">
          <Star size={30} aria-hidden="true" className={i <= value ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20 hover:text-forest-600/40'} />
        </button>
      ))}
    </div>
  )
}
function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest-600/10 text-forest-600">{icon}</span>
      <span>
        <span className="block text-lg font-semibold text-ink-900">{value}</span>
        <span className="block text-xs text-ink-700">{label}</span>
      </span>
    </div>
  )
}
function useEsc(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-700">{text}</div>
}
function Skeleton() {
  return <div className="space-y-3" aria-hidden="true">{[0, 1, 2].map((i) => (
    <div key={i} className="rounded-xl bg-cream-50 p-5 shadow-sm ring-1 ring-ink-900/5">
      <div className="h-4 w-1/3 animate-pulse rounded bg-ink-900/10" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-ink-900/5" />
    </div>))}</div>
}

export default function EmployerDashboard() {
  const [tab, setTab] = useState<'hire' | 'post' | 'history'>('hire')
  const [viewing, setViewing] = useState<Worker | null>(null)
  const [dispatching, setDispatching] = useState<Worker | null>(null)
  const [rating, setRating] = useState<Task | null>(null)
  const [editing, setEditing] = useState(false)

  const [workerList, setWorkerList] = useState<Worker[]>([])
  const [taskList, setTaskList] = useState<Task[]>([])
  const [profile, setProfile] = useState<Employer | null>(session.employer())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [announce, setAnnounce] = useState('')
  const [toast, setToast] = useState<ToastMsg>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [wRes, tRes, pRes] = await Promise.all([
        workersApi.list(),
        tasksApi.all(),
        employersApi.profile().catch(() => null),
      ])
      setWorkerList(wRes?.workers || [])
      setTaskList(tRes?.tasks || [])
      const emp = (pRes as { employer?: Employer } | null)?.employer
      if (emp) { setProfile(emp); session.patchEmployer(emp) }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your dashboard.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  const orgName = (profile?.orgName as string) || 'Your organisation'
  const logo = (profile?.logoUrl as string) || undefined
  const active = taskList.filter((t) => t.status && !['completed', 'employer_confirmed'].includes(t.status))

  const afterDispatch = () => {
    setDispatching(null)
    setAnnounce('Worker dispatched.')
    setToast({ id: Date.now(), kind: 'success', title: 'Worker dispatched', detail: 'Payment is held by BeyondX. The worker will accept or decline shortly — track it under Dispatch History.' })
    load()
  }
  const afterConfirm = (worker: string) => {
    setRating(null)
    setAnnounce(`Work confirmed for ${worker}.`)
    setToast({ id: Date.now(), kind: 'success', title: 'Work confirmed', detail: `BeyondX is now processing payment to ${worker}. It shows "Payment released" once done.` })
    load()
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader role="EMPLOYER" title="Employer Dashboard" name={orgName} avatar={logo} onEditProfile={() => setEditing(true)} />
      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <p aria-live="polite" className="sr-only">{announce}</p>

        {error && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-red-700"><AlertCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" /> {error}</p>
            <button onClick={() => { setLoading(true); load() }} className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-cream-50 hover:bg-red-700">Try again</button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={<img src="/icons/dispatches.png" alt="" className="h-5 w-5 object-contain" />} label="Active dispatches" value={`${active.length}`} />
          <Stat icon={<img src="/icons/workers.png" alt="" className="h-6 w-6 object-contain" />} label="Workers available" value={`${workerList.length}`} />
          <Stat icon={<img src="/icons/dispatched.png" alt="" className="h-5 w-5 object-contain" />} label="Total dispatched" value={`${taskList.length}`} />
        </div>

        <div className="mt-8 flex items-center gap-2 overflow-x-auto border-b border-ink-900/10 pb-px" role="tablist" aria-label="Employer sections">
          {([['hire', 'Hire Workers'], ['post', 'Post a Task'], ['history', `Dispatch History (${taskList.length})`]] as const).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${tab === id ? 'border-forest-600 text-forest-700' : 'border-transparent text-ink-700 hover:text-ink-900'}`}>
              {label}
            </button>
          ))}
          <button onClick={() => { setLoading(true); load() }} aria-label="Refresh" className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-900/5">
            <RefreshCw size={13} aria-hidden="true" /> Refresh
          </button>
        </div>

        {tab === 'hire' && (
          <div className="mt-6">
            {loading ? <Skeleton /> : workerList.length ? (
              <ul className="divide-y divide-ink-900/10 overflow-hidden rounded-2xl bg-cream-50 shadow-sm ring-1 ring-ink-900/5">
                {workerList.map((w) => (
                  <li key={String(w.id)}>
                    <button onClick={() => setViewing(w)} aria-label={`View ${wName(w)}'s profile`}
                      className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-forest-600/5 focus:outline-none focus-visible:bg-forest-600/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-600/40 sm:px-5">
                      {w.photoUrl ? <img src={w.photoUrl as string} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                        : <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-cream-50">{wInitials(w)}</span>}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-serif text-base font-medium text-ink-900">{wName(w)}</span>
                        <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-700">
                          {w.rating && Number(w.rating) > 0 ? <span className="inline-flex items-center gap-0.5"><Star size={12} aria-hidden="true" className="fill-forest-600 text-forest-600" /> {Number(w.rating).toFixed(1)}</span> : <span>New worker</span>}
                          {wSkills(w).length ? <span>· {wSkills(w).slice(0, 2).join(', ')}</span> : null}
                          {w.isBusy ? <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">On a job</span> : null}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-sm font-medium text-forest-700 sm:inline">View profile</span>
                      <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink-700" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : <Empty text="No workers available yet." />}
          </div>
        )}

        {tab === 'post' && <PostTask onDone={(msg) => { setToast({ id: Date.now(), kind: 'success', title: 'Task posted', detail: msg }); load() }} />}

        {tab === 'history' && (
          <div className="mt-6 space-y-3">
            {loading ? <Skeleton /> : taskList.length ? taskList.map((t) => {
              const s = st(t.status)
              const worker = typeof t.employer === 'string' ? t.employer : ''
              const rev = t.reviews?.[0]?.rating
              return (
                <div key={String(t.id)} className="rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-serif text-base font-medium text-ink-900">{t.taskType || 'Task'}</p>
                      <p className="mt-0.5 truncate text-sm text-ink-700">{t.description || worker}{t.location ? ` · ${t.location}` : ''}</p>
                      {rev ? <div className="mt-1 flex items-center gap-2 text-xs text-ink-700">You rated <Stars n={Number(rev)} /></div> : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.chip}`}>
                        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.label}
                      </span>
                      {t.status === 'pending_confirmation' && (
                        <button onClick={() => setRating(t)} className="shrink-0 rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
                          Confirm work &amp; rate
                        </button>
                      )}
                    </div>
                  </div>
                  {s.note && <p className="mt-3 flex items-start gap-2 border-t border-ink-900/10 pt-3 text-xs leading-relaxed text-ink-700"><Info size={13} aria-hidden="true" className="mt-0.5 shrink-0 text-clay-500" /> {s.note}</p>}
                </div>
              )
            }) : <Empty text="No dispatches yet. Hire a worker to get started." />}
          </div>
        )}
      </main>

      <Toast toast={toast} onClose={() => setToast(null)} />

      {viewing && <WorkerProfileModal worker={viewing} onClose={() => setViewing(null)} onDispatch={() => { const w = viewing; setViewing(null); setDispatching(w) }} />}
      {dispatching && <DispatchModal worker={dispatching} onClose={() => setDispatching(null)} onDone={afterDispatch} onError={(m) => setToast({ id: Date.now(), kind: 'info', title: 'Dispatch failed', detail: m })} />}
      {rating && <RateModal task={rating} onClose={() => setRating(null)} onDone={afterConfirm} onError={(m) => setToast({ id: Date.now(), kind: 'info', title: 'Could not confirm', detail: m })} />}
      {editing && profile !== undefined && (
        <ProfileModal
          role="EMPLOYER"
          initial={{ avatar: logo, name: orgName, contact: (profile?.contactPerson as string) || '', phone: (profile?.phone as string) || '', region: (profile?.region as string) || '', bio: '' }}
          onClose={() => setEditing(false)}
          onSave={async (p) => {
            setEditing(false)
            try {
              await employersApi.updateProfile({ contactPerson: p.contact, phone: p.phone, region: p.region })
              session.patchEmployer({ contactPerson: p.contact, phone: p.phone, region: p.region })
              setToast({ id: Date.now(), kind: 'success', title: 'Profile updated', detail: 'Your organisation details are up to date.' })
              load()
            } catch (e) {
              setToast({ id: Date.now(), kind: 'info', title: 'Could not save profile', detail: e instanceof ApiError ? e.message : 'Please try again.' })
            }
          }}
        />
      )}
    </div>
  )
}

function WorkerProfileModal({ worker, onClose, onDispatch }: { worker: Worker; onClose: () => void; onDispatch: () => void }) {
  useEsc(onClose)
  const skills = wSkills(worker)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="wp-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-cream-50 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="relative rounded-t-2xl bg-forest-700 px-6 pb-6 pt-6 text-center">
          <button onClick={onClose} aria-label="Close profile" className="absolute right-4 top-4 rounded-lg p-1 text-cream-50/80 transition-colors hover:bg-cream-50/10 hover:text-cream-50"><X size={18} aria-hidden="true" /></button>
          {worker.photoUrl ? <img src={worker.photoUrl as string} alt="" className="mx-auto h-20 w-20 rounded-full object-cover ring-2 ring-cream-50/30" />
            : <span aria-hidden="true" className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-50 font-serif text-2xl font-bold text-forest-700 shadow-md">{wInitials(worker)}</span>}
          <h2 id="wp-title" className="mt-3 font-serif text-2xl font-medium text-cream-50">{wName(worker)}</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            {worker.rating && Number(worker.rating) > 0 ? <span className="inline-flex items-center gap-1 rounded-full bg-cream-50/15 px-2.5 py-0.5 text-xs font-semibold text-cream-50"><Star size={12} aria-hidden="true" className="fill-cream-50 text-cream-50" /> {Number(worker.rating).toFixed(1)}</span> : null}
          </div>
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-cream-200/90"><ShieldCheck size={14} aria-hidden="true" /> BeyondX Verified · Certified Worker</p>
        </div>
        <div className="grid grid-cols-2 gap-3 border-b border-ink-900/10 p-6">
          <div className="rounded-xl bg-cream-100 p-4 text-center"><span className="block font-serif text-2xl font-semibold text-ink-900">{Number(worker.tasksCompleted ?? worker.tasks ?? 0)}</span><span className="text-xs text-ink-700">Tasks completed</span></div>
          <div className="rounded-xl bg-cream-100 p-4 text-center"><span className="block font-serif text-2xl font-semibold text-ink-900">{cedis(wCharge(worker))}</span><span className="text-xs text-ink-700">Rate per day</span></div>
        </div>
        <div className="space-y-4 p-6">
          {worker.phone ? <div><h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-clay-500">Contact</h3><div className="flex items-center gap-2 text-sm text-ink-900"><Phone size={15} aria-hidden="true" className="text-forest-600" /> {worker.phone as string}</div></div> : null}
          {skills.length ? (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-clay-500">Certified Skills</h3>
              <ul className="overflow-hidden rounded-xl ring-1 ring-ink-900/10">
                {skills.map((s, i) => (
                  <li key={s} className={`flex items-center gap-3 px-4 py-3 ${i % 2 ? 'bg-cream-100/60' : 'bg-cream-50'}`}>
                    <CircleCheck size={16} aria-hidden="true" className="shrink-0 text-forest-600" />
                    <span className="flex-1 text-sm font-medium text-ink-900">{s}</span>
                    <span className="shrink-0 rounded-full bg-forest-600/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-forest-700">Certified</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <div className="border-t border-ink-900/10 p-6">
          <button onClick={onDispatch} disabled={!!worker.isBusy} aria-label={`Dispatch ${wName(worker)}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
            <Send size={15} aria-hidden="true" /> {worker.isBusy ? 'Currently on a job' : `Dispatch ${wName(worker).split(' ')[0]}`}
          </button>
        </div>
      </div>
    </div>
  )
}

function DispatchModal({ worker, onClose, onDone, onError }: { worker: Worker; onClose: () => void; onDone: () => void; onError: (m: string) => void }) {
  useEsc(onClose)
  const [days, setDays] = useState(1)
  const [location, setLocation] = useState('')
  const [taskType, setTaskType] = useState(wSkills(worker)[0] || 'General Task')
  const [payRef, setPayRef] = useState('')
  const [busy, setBusy] = useState(false)
  const pay = wCharge(worker) * days
  const duration = days === 0.5 ? 'Half Day' : days === 1 ? '1 Day' : `${days} Days`

  const submit = async () => {
    if (!payRef.trim() || busy) return
    setBusy(true)
    try {
      await tasksApi.dispatch({ worker, taskType, location, duration, pay, paymentRef: payRef.trim() })
      onDone()
    } catch (e) {
      onError(e instanceof ApiError ? e.message : 'Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="dp-title" className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-cream-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h2 id="dp-title" className="font-serif text-xl font-medium text-ink-900">Dispatch {wName(worker).split(' ')[0]}</h2>
          <button onClick={onClose} aria-label="Cancel dispatch" className="rounded-lg p-1 text-ink-700 hover:bg-ink-900/5"><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="mb-4 text-sm text-ink-700">Pay {wName(worker)} via mobile money, then enter your payment reference below. BeyondX holds the payment and releases it once you confirm the work.</p>

        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-700">Task type</span>
            <input value={taskType} onChange={(e) => setTaskType(e.target.value)} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-700">Location</span>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Tema" className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-700">Duration</span>
            <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30">
              <option value={0.5}>Half Day</option><option value={1}>1 Day</option><option value={2}>2 Days</option><option value={3}>3 Days</option><option value={5}>5 Days</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-forest-600/5 p-4 ring-1 ring-forest-600/15">
          <span className="text-sm text-ink-700">Amount to pay</span>
          <span className="font-serif text-lg font-semibold text-ink-900">{cedis(pay)}</span>
        </div>

        <label className="mt-4 block">
          <span className="mb-1 block text-xs font-medium text-ink-700">Payment reference / transaction ID</span>
          <input value={payRef} onChange={(e) => setPayRef(e.target.value)} placeholder="e.g. 1234567890" className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
        </label>

        <button onClick={submit} disabled={!payRef.trim() || busy} className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
          <ShieldCheck size={16} aria-hidden="true" /> {busy ? 'Dispatching…' : 'Confirm & dispatch'}
        </button>
        <p className="mt-2 text-center text-xs text-ink-700">The worker is notified once your payment reference is recorded.</p>
      </div>
    </div>
  )
}

function RateModal({ task, onClose, onDone, onError }: { task: Task; onClose: () => void; onDone: (worker: string) => void; onError: (m: string) => void }) {
  useEsc(onClose)
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const worker = typeof task.employer === 'string' ? task.employer : task.taskType || 'the worker'

  const submit = async () => {
    if (busy) return
    setBusy(true)
    try {
      await tasksApi.complete(task.id)
      await tasksApi.review(task.id, stars, comment).catch(() => null)
      onDone(worker)
    } catch (e) {
      onError(e instanceof ApiError ? e.message : 'Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="rt-title" className="w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h2 id="rt-title" className="font-serif text-xl font-medium text-ink-900">Confirm work &amp; rate</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-ink-700 hover:bg-ink-900/5"><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="mb-4 text-sm text-ink-700">Confirm the work is done and rate it. Once you confirm, BeyondX reviews and releases the payment we are holding to the worker.</p>
        <StarPicker value={stars} onChange={setStars} />
        <label htmlFor="rt-comment" className="sr-only">Feedback</label>
        <textarea id="rt-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Feedback on the work (optional)" className="mt-4 w-full rounded-xl border border-ink-900/15 bg-white p-3 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
        <button onClick={submit} disabled={busy} className="mt-4 w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
          {busy ? 'Confirming…' : 'Confirm work is done'}
        </button>
      </div>
    </div>
  )
}

function PostTask({ onDone }: { onDone: (msg: string) => void }) {
  const [taskType, setTaskType] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('1 Day')
  const [pay, setPay] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async () => {
    if (!taskType || !location || busy) return
    setErr(null); setBusy(true)
    try {
      await tasksApi.create({ taskType, description, location, duration, pay: parseFloat(pay) || 0 })
      setTaskType(''); setDescription(''); setLocation(''); setPay('')
      onDone(`"${taskType}" is now open for workers to accept.`)
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const inp = 'w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30'
  return (
    <div className="mt-6 max-w-xl">
      <div className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-ink-900/5">
        <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Post a new task</h2>
        <div className="space-y-3">
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink-700">Task type</span><input value={taskType} onChange={(e) => setTaskType(e.target.value)} placeholder="e.g. Facility & Cleaning" className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink-700">Description</span><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What needs doing" className={inp} /></label>
          <label className="block"><span className="mb-1 block text-xs font-medium text-ink-700">Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Tema" className={inp} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1 block text-xs font-medium text-ink-700">Duration</span>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className={inp}><option>Half Day</option><option>1 Day</option><option>2 Days</option><option>3 Days</option><option>5 Days</option></select>
            </label>
            <label className="block"><span className="mb-1 block text-xs font-medium text-ink-700">Pay (GH₵)</span><input type="number" value={pay} onChange={(e) => setPay(e.target.value)} placeholder="120" className={inp} /></label>
          </div>
          {err && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">{err}</p>}
          <button onClick={submit} disabled={busy} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
            <Plus size={16} aria-hidden="true" /> {busy ? 'Posting…' : 'Post task'}
          </button>
        </div>
      </div>
    </div>
  )
}
