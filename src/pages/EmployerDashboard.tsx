import { useEffect, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Star, Send, Phone, Briefcase, Plus, X, ShieldCheck } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import ProfileModal, { type Profile } from '../components/ProfileModal'
import { categories } from '../data'

type Worker = { id: number; name: string; initials: string; rank: 'Gold' | 'Silver' | 'Bronze'; rating: number; jobs: number; phone: string; experience: string; skills: string[]; avgPay: number }
type Status = 'Awaiting worker' | 'In progress' | 'Completed'
type Dispatch = { id: number; worker: string; category: string; date: string; status: Status; rating?: number }
type Posted = { id: number; title: string; category: string; location: string; date: string; pay: number }

const WORKERS: Worker[] = [
  { id: 1, name: 'Kofi Asante', initials: 'KA', rank: 'Gold', rating: 5, jobs: 48, phone: '024 123 4567', experience: '6 years', skills: ['Logistics', 'Warehouse', 'Heavy lifting'], avgPay: 130 },
  { id: 2, name: 'Yaw Boateng', initials: 'YB', rank: 'Silver', rating: 4, jobs: 23, phone: '020 987 6543', experience: '3 years', skills: ['Painting', 'Tiling'], avgPay: 110 },
  { id: 3, name: 'Ama Serwaa', initials: 'AS', rank: 'Silver', rating: 5, jobs: 31, phone: '055 456 7890', experience: '4 years', skills: ['Cleaning', 'Facility care'], avgPay: 95 },
  { id: 4, name: 'Kwesi Owusu', initials: 'KO', rank: 'Bronze', rating: 4, jobs: 9, phone: '026 321 0987', experience: '1 year', skills: ['General labour', 'Events'], avgPay: 85 },
]
const INITIAL_DISPATCH: Dispatch[] = [
  { id: 100, worker: 'Kofi Asante', category: 'Logistics & Moving', date: 'Yesterday', status: 'Completed', rating: 5 },
  { id: 101, worker: 'Ama Serwaa', category: 'Landscaping & Cleaning', date: '3 days ago', status: 'In progress' },
]
const EMPLOYER_PROFILE: Profile = { name: 'Accra Build Co.', contact: 'Ama Mensah', phone: '024 000 0000', region: 'Greater Accra', bio: '' }

const cedis = (n: number) => `GH\u20b5 ${n.toLocaleString()}`
const rankStyle: Record<Worker['rank'], string> = {
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-ink-900/10 text-ink-700',
  Bronze: 'bg-orange-100 text-orange-700',
}

function useEsc(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
}
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
function Field({ label, id, ...p }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-ink-700">{label}</label>
      <input id={id} {...p} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
    </div>
  )
}

export default function EmployerDashboard() {
  const [tab, setTab] = useState<'hire' | 'post' | 'history'>('hire')
  const [category, setCategory] = useState<string | null>(null)
  const [dispatches, setDispatches] = useState<Dispatch[]>(INITIAL_DISPATCH)
  const [rating, setRating] = useState<Dispatch | null>(null)
  const [paying, setPaying] = useState<Worker | null>(null)
  const [posted, setPosted] = useState<Posted[]>([])
  const [profile, setProfile] = useState<Profile>(EMPLOYER_PROFILE)
  const [editing, setEditing] = useState(false)
  const [announce, setAnnounce] = useState('')

  const confirmDispatch = (w: Worker) => {
    setDispatches((d) => [{ id: Date.now(), worker: w.name, category: category!, date: 'Just now', status: 'Awaiting worker' }, ...d])
    setPaying(null)
    setAnnounce(`Payment successful. ${w.name} has been dispatched and will accept or decline shortly.`)
  }
  const completeAndRate = (stars: number) => {
    if (!rating) return
    setDispatches((d) => d.map((x) => (x.id === rating.id ? { ...x, status: 'Completed', rating: stars } : x)))
    setAnnounce(`${rating.worker} marked complete. Payment released.`)
    setRating(null)
  }
  const addTask = (t: Posted) => { setPosted((p) => [t, ...p]); setAnnounce('Task posted. Workers can now see it.') }

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader role="EMPLOYER" title="Employer Dashboard" name={profile.name} avatar={profile.avatar} onEditProfile={() => setEditing(true)} />
      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <p aria-live="polite" className="sr-only">{announce}</p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={<img src="/icons/dispatches.png" alt="" className="h-5 w-5 object-contain" />} label="Active dispatches" value={`${dispatches.filter((d) => d.status !== 'Completed').length}`} />
          <Stat icon={<img src="/icons/workers.png" alt="" className="h-6 w-6 object-contain" />} label="Workers available" value={`${WORKERS.length}`} />
          <Stat icon={<img src="/icons/dispatched.png" alt="" className="h-5 w-5 object-contain" />} label="Total dispatched" value={`${dispatches.length}`} />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-ink-900/10 pb-px" role="tablist" aria-label="Employer sections">
          {([['hire', 'Hire Workers'], ['post', 'Post a Task'], ['history', `Dispatch History (${dispatches.length})`]] as const).map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 ${tab === id ? 'border-forest-600 text-forest-700' : 'border-transparent text-ink-700 hover:text-ink-900'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* HIRE: clean category list */}
        {tab === 'hire' && !category && (
          <div className="mt-6">
            <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Select a task category</h2>
            <ul className="divide-y divide-ink-900/10 overflow-hidden rounded-2xl bg-cream-50 shadow-sm ring-1 ring-ink-900/5">
              {categories.map((c) => (
                <li key={c.title}>
                  <button onClick={() => setCategory(c.title)}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-forest-600/5 focus:outline-none focus-visible:bg-forest-600/5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest-600/40">
                    <span>
                      <span className="block font-serif text-base font-medium text-ink-900">{c.title}</span>
                      {c.description && <span className="mt-0.5 block text-sm text-ink-700">{c.description}</span>}
                    </span>
                    <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink-700" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* HIRE: worker detail cards */}
        {tab === 'hire' && category && (
          <div className="mt-6">
            <button onClick={() => setCategory(null)} className="mb-4 flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-forest-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
              <ChevronLeft size={16} aria-hidden="true" /> Back to categories
            </button>
            <h2 className="mb-1 font-serif text-xl font-medium text-ink-900">Available workers</h2>
            <p className="mb-4 text-sm text-ink-700">Verified workers for <span className="font-medium text-ink-900">{category}</span></p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {WORKERS.map((w) => (
                <div key={w.id} className="rounded-2xl bg-cream-50 p-5 shadow-sm ring-1 ring-ink-900/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-600 text-base font-bold text-cream-50">{w.initials}</span>
                      <div className="min-w-0">
                        <p className="truncate font-serif text-lg font-medium text-ink-900">{w.name}</p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-700">
                          <span className={`rounded-full px-2 py-0.5 font-medium ${rankStyle[w.rank]}`}>{w.rank}</span>
                          <span className="inline-flex items-center gap-0.5"><Star size={12} aria-hidden="true" className="fill-forest-600 text-forest-600" /> {w.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => setPaying(w)} aria-label={`Dispatch ${w.name}`}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
                      <Send size={15} aria-hidden="true" /> Dispatch
                    </button>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-900/10 pt-4 text-sm">
                    <div className="flex items-center gap-2 text-ink-700"><Phone size={15} aria-hidden="true" className="text-forest-600" /> <dd>{w.phone}</dd></div>
                    <div className="flex items-center gap-2 text-ink-700"><Briefcase size={15} aria-hidden="true" className="text-forest-600" /> <dd>{w.experience} experience</dd></div>
                    <div className="text-ink-700"><dd><span className="font-semibold text-ink-900">{w.jobs}</span> tasks done</dd></div>
                    <div className="text-ink-700"><dd><span className="font-semibold text-ink-900">{cedis(w.avgPay)}</span> avg / task</dd></div>
                  </dl>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {w.skills.map((s) => <span key={s} className="rounded-full bg-forest-600/10 px-2.5 py-0.5 text-xs font-medium text-forest-700">{s}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POST A TASK */}
        {tab === 'post' && <PostTask onAdd={addTask} posted={posted} />}

        {/* HISTORY */}
        {tab === 'history' && (
          <div className="mt-6 space-y-3">
            {dispatches.map((d) => (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                  <p className="font-serif text-base font-medium text-ink-900">{d.worker}</p>
                  <p className="mt-0.5 text-sm text-ink-700">{d.category} · {d.date}</p>
                  {d.status === 'Completed' && d.rating && (
                    <div className="mt-1 flex items-center gap-2 text-xs text-ink-700">You rated <Stars n={d.rating} /> · <span className="text-forest-700">Payment released</span></div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    d.status === 'Completed' ? 'bg-forest-600/10 text-forest-700'
                    : d.status === 'In progress' ? 'bg-amber-100 text-amber-700'
                    : 'bg-ink-900/10 text-ink-700'}`}>
                    {d.status}
                  </span>
                  {d.status !== 'Completed' && (
                    <button onClick={() => setRating(d)}
                      className="shrink-0 rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
                      Mark complete &amp; rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {paying && <PaymentModal worker={paying} category={category!} onClose={() => setPaying(null)} onPaid={() => confirmDispatch(paying)} />}
      {rating && <RateModal worker={rating.worker} onClose={() => setRating(null)} onSubmit={completeAndRate} />}
      {editing && <ProfileModal role="EMPLOYER" initial={profile} onClose={() => setEditing(false)} onSave={(p) => { setProfile(p); setEditing(false); setAnnounce('Profile updated.') }} />}
    </div>
  )
}

function PostTask({ onAdd, posted }: { onAdd: (t: Posted) => void; posted: Posted[] }) {
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState(categories[0].title)
  const [loc, setLoc] = useState('')
  const [date, setDate] = useState('')
  const [pay, setPay] = useState('')
  const [ok, setOk] = useState(false)
  const submit = () => {
    if (!title || !loc) return
    onAdd({ id: Date.now(), title, category: cat, location: loc, date: date || 'Flexible', pay: Number(pay) || 0 })
    setTitle(''); setLoc(''); setDate(''); setPay('')
    setOk(true); setTimeout(() => setOk(false), 2500)
  }
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-cream-50 p-6 shadow-sm ring-1 ring-ink-900/5">
        <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Post a new task</h2>
        <div className="space-y-3">
          <Field id="pt-title" label="Task title" placeholder="e.g. Warehouse stock sorting" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div>
            <label htmlFor="pt-cat" className="mb-1 block text-xs font-medium text-ink-700">Category</label>
            <select id="pt-cat" value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30">
              {categories.map((c) => <option key={c.title}>{c.title}</option>)}
            </select>
          </div>
          <Field id="pt-loc" label="Location" placeholder="e.g. Tema" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field id="pt-date" label="Date / time" placeholder="e.g. Mon · 8:00 AM" value={date} onChange={(e) => setDate(e.target.value)} />
            <Field id="pt-pay" label="Pay (GH₵)" type="number" placeholder="120" value={pay} onChange={(e) => setPay(e.target.value)} />
          </div>
          <button onClick={submit} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
            <Plus size={16} aria-hidden="true" /> Post task
          </button>
          {ok && <p role="status" className="text-center text-sm font-medium text-forest-700">Task posted — workers can now see it.</p>}
        </div>
      </div>
      <div>
        <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Your posted tasks</h2>
        <div className="space-y-3">
          {posted.length ? posted.map((t) => (
            <div key={t.id} className="rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5">
              <span className="mb-1 inline-block rounded-full bg-forest-600/10 px-2.5 py-0.5 text-xs font-medium text-forest-700">{t.category}</span>
              <h3 className="font-serif text-lg font-medium text-ink-900">{t.title}</h3>
              <p className="mt-0.5 text-sm text-ink-700">{t.location} · {t.date} · <span className="font-semibold text-ink-900">{cedis(t.pay)}</span></p>
            </div>
          )) : <div className="rounded-xl border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-700">No posted tasks yet. Create one on the left.</div>}
        </div>
      </div>
    </div>
  )
}

function PaymentModal({ worker, category, onClose, onPaid }: { worker: Worker; category: string; onClose: () => void; onPaid: () => void }) {
  useEsc(onClose)
  const [provider, setProvider] = useState('MTN MoMo')
  const [number, setNumber] = useState('')
  const [processing, setProcessing] = useState(false)
  const pay = () => { setProcessing(true); setTimeout(onPaid, 900) }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="pay-title" className="w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h2 id="pay-title" className="font-serif text-xl font-medium text-ink-900">Confirm &amp; pay</h2>
          <button onClick={onClose} aria-label="Cancel payment" className="rounded-lg p-1 text-ink-700 hover:bg-ink-900/5"><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="mb-4 text-sm text-ink-700">Payment is held securely and released to <span className="font-medium text-ink-900">{worker.name}</span> only after the job is completed and rated.</p>

        <div className="mb-4 rounded-xl bg-forest-600/5 p-4 ring-1 ring-forest-600/15">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-700">Worker</span><span className="font-medium text-ink-900">{worker.name}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-ink-700">Category</span><span className="font-medium text-ink-900">{category}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-forest-600/15 pt-2">
            <span className="text-sm text-ink-700">Amount</span><span className="font-serif text-lg font-semibold text-ink-900">{cedis(worker.avgPay)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label htmlFor="pay-provider" className="mb-1 block text-xs font-medium text-ink-700">Mobile money provider</label>
            <select id="pay-provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30">
              <option>MTN MoMo</option><option>Telecel Cash</option><option>AirtelTigo Money</option>
            </select>
          </div>
          <div>
            <label htmlFor="pay-number" className="mb-1 block text-xs font-medium text-ink-700">Mobile money number</label>
            <input id="pay-number" type="tel" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="0244 000 000" className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
          </div>
        </div>

        <button onClick={pay} disabled={processing} className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
          <ShieldCheck size={16} aria-hidden="true" /> {processing ? 'Processing…' : `Pay ${cedis(worker.avgPay)} & dispatch`}
        </button>
        <p className="mt-2 text-center text-xs text-ink-700">The worker will accept or decline after you pay.</p>
      </div>
    </div>
  )
}

function RateModal({ worker, onClose, onSubmit }: { worker: string; onClose: () => void; onSubmit: (stars: number) => void }) {
  useEsc(onClose)
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="rate-title" className="w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h2 id="rate-title" className="font-serif text-xl font-medium text-ink-900">Rate &amp; complete</h2>
          <button onClick={onClose} aria-label="Close rating" className="rounded-lg p-1 text-ink-700 hover:bg-ink-900/5"><X size={18} aria-hidden="true" /></button>
        </div>
        <p className="mb-4 text-sm text-ink-700">Rate <span className="font-medium text-ink-900">{worker}</span>'s work. Payment is released to the worker once you complete this step.</p>
        <StarPicker value={stars} onChange={setStars} />
        <label htmlFor="rate-comment" className="sr-only">Feedback</label>
        <textarea id="rate-comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Feedback on the work (optional)"
          className="mt-4 w-full rounded-xl border border-ink-900/15 bg-white p-3 text-sm text-ink-900 outline-none focus:border-forest-600 focus:ring-2 focus:ring-forest-600/30" />
        <button onClick={() => onSubmit(stars)} className="mt-4 w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40">
          Complete &amp; release payment
        </button>
      </div>
    </div>
  )
}
