import { useState, type ReactNode } from 'react'
import { ChevronLeft, Star, Send, CheckCircle2, Users, Truck, Phone, Briefcase, Plus, X } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import { categories } from '../data'

type Worker = { id: number; name: string; initials: string; rank: 'Gold' | 'Silver' | 'Bronze'; rating: number; jobs: number; phone: string; experience: string; skills: string[]; avgPay: number }
type Dispatch = { id: number; worker: string; category: string; date: string; status: 'Dispatched' | 'In progress' | 'Completed'; rating?: number }
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

const cedis = (n: number) => `GH\u20b5 ${n.toLocaleString()}`
const rankStyle: Record<Worker['rank'], string> = {
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-ink-900/10 text-ink-700',
  Bronze: 'bg-orange-100 text-orange-700',
}

function Stars({ n }: { n: number }) {
  return <span className="inline-flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className={i <= n ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20'} />)}</span>
}
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return <div className="flex gap-1">{[1, 2, 3, 4, 5].map((i) => <button key={i} type="button" onClick={() => onChange(i)} className="transition-transform active:scale-90"><Star size={30} className={i <= value ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20 hover:text-forest-600/40'} /></button>)}</div>
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
function Field({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-700">{label}</span>
      <input {...p} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600" />
    </label>
  )
}

export default function EmployerDashboard() {
  const [tab, setTab] = useState<'hire' | 'post' | 'history'>('hire')
  const [category, setCategory] = useState<string | null>(null)
  const [dispatches, setDispatches] = useState<Dispatch[]>(INITIAL_DISPATCH)
  const [justSent, setJustSent] = useState<number | null>(null)
  const [rating, setRating] = useState<Dispatch | null>(null)
  const [posted, setPosted] = useState<Posted[]>([])

  const dispatch = (w: Worker) => {
    setDispatches((d) => [{ id: Date.now(), worker: w.name, category: category!, date: 'Just now', status: 'Dispatched' }, ...d])
    setJustSent(w.id)
    setTimeout(() => setJustSent(null), 2000)
  }
  const completeAndRate = (stars: number) => {
    if (!rating) return
    setDispatches((d) => d.map((x) => (x.id === rating.id ? { ...x, status: 'Completed', rating: stars } : x)))
    setRating(null)
  }
  const addTask = (t: Posted) => setPosted((p) => [t, ...p])

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader role="EMPLOYER" title="Employer Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={<Truck size={20} />} label="Active dispatches" value={`${dispatches.filter((d) => d.status !== 'Completed').length}`} />
          <Stat icon={<Users size={20} />} label="Workers available" value={`${WORKERS.length}`} />
          <Stat icon={<img src="/icons/tasks.png" alt="" className="h-5 w-5 object-contain" />} label="Tasks posted" value={`${posted.length}`} />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-ink-900/10 pb-px">
          {([['hire', 'Hire Workers'], ['post', 'Post a Task'], ['history', `Dispatch History (${dispatches.length})`]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${tab === id ? 'border-forest-600 text-forest-700' : 'border-transparent text-ink-700 hover:text-ink-900'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* HIRE: categories */}
        {tab === 'hire' && !category && (
          <div className="mt-6">
            <h2 className="mb-4 font-serif text-xl font-medium text-ink-900">Select a task category</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => (
                <button key={c.title} onClick={() => setCategory(c.title)} className="img-zoom group overflow-hidden rounded-xl text-left shadow-sm ring-1 ring-ink-900/5 transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={c.image} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
                    <span className="absolute bottom-2 left-3 right-3 font-serif text-sm font-medium text-cream-50">{c.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* HIRE: worker detail cards */}
        {tab === 'hire' && category && (
          <div className="mt-6">
            <button onClick={() => setCategory(null)} className="mb-4 flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-forest-600">
              <ChevronLeft size={16} /> Back to categories
            </button>
            <h2 className="mb-1 font-serif text-xl font-medium text-ink-900">Available workers</h2>
            <p className="mb-4 text-sm text-ink-700">Verified workers for <span className="font-medium text-ink-900">{category}</span></p>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {WORKERS.map((w) => (
                <div key={w.id} className="rounded-2xl bg-cream-50 p-5 shadow-sm ring-1 ring-ink-900/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-600 text-base font-bold text-cream-50">{w.initials}</span>
                      <div className="min-w-0">
                        <p className="truncate font-serif text-lg font-medium text-ink-900">{w.name}</p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-700">
                          <span className={`rounded-full px-2 py-0.5 font-medium ${rankStyle[w.rank]}`}>{w.rank}</span>
                          <span className="inline-flex items-center gap-0.5"><Star size={12} className="fill-forest-600 text-forest-600" /> {w.rating}.0</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => dispatch(w)} disabled={justSent === w.id}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:bg-forest-700">
                      {justSent === w.id ? <><CheckCircle2 size={16} /> Sent</> : <><Send size={15} /> Dispatch</>}
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-ink-900/10 pt-4 text-sm">
                    <div className="flex items-center gap-2 text-ink-700"><Phone size={15} className="text-forest-600" /> {w.phone}</div>
                    <div className="flex items-center gap-2 text-ink-700"><Briefcase size={15} className="text-forest-600" /> {w.experience} experience</div>
                    <div className="text-ink-700"><span className="font-semibold text-ink-900">{w.jobs}</span> tasks done</div>
                    <div className="text-ink-700"><span className="font-semibold text-ink-900">{cedis(w.avgPay)}</span> avg / task</div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {w.skills.map((s) => (
                      <span key={s} className="rounded-full bg-forest-600/10 px-2.5 py-0.5 text-xs font-medium text-forest-700">{s}</span>
                    ))}
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
                    <button onClick={() => setRating(d)} className="shrink-0 rounded-full bg-forest-600 px-4 py-2 text-xs font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98]">
                      Mark complete &amp; rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {rating && <RateModal worker={rating.worker} onClose={() => setRating(null)} onSubmit={completeAndRate} />}
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
          <Field label="Task title" placeholder="e.g. Warehouse stock sorting" value={title} onChange={(e) => setTitle(e.target.value)} />
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-700">Category</span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-forest-600">
              {categories.map((c) => <option key={c.title}>{c.title}</option>)}
            </select>
          </label>
          <Field label="Location" placeholder="e.g. Tema" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date / time" placeholder="e.g. Mon · 8:00 AM" value={date} onChange={(e) => setDate(e.target.value)} />
            <Field label="Pay (GH₵)" type="number" placeholder="120" value={pay} onChange={(e) => setPay(e.target.value)} />
          </div>
          <button onClick={submit} className="flex w-full items-center justify-center gap-1.5 rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98]">
            <Plus size={16} /> Post task
          </button>
          {ok && <p className="text-center text-sm font-medium text-forest-700">Task posted — workers can now see it.</p>}
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

function RateModal({ worker, onClose, onSubmit }: { worker: string; onClose: () => void; onSubmit: (stars: number) => void }) {
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-serif text-xl font-medium text-ink-900">Rate &amp; complete</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-700 hover:bg-ink-900/5"><X size={18} /></button>
        </div>
        <p className="mb-4 text-sm text-ink-700">Rate <span className="font-medium text-ink-900">{worker}</span>'s work. Payment is released to the worker once you complete this step.</p>
        <StarPicker value={stars} onChange={setStars} />
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Feedback on the work (optional)"
          className="mt-4 w-full rounded-xl border border-ink-900/15 bg-white p-3 text-sm text-ink-900 outline-none focus:border-forest-600" />
        <button onClick={() => onSubmit(stars)} className="mt-4 w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98]">
          Complete &amp; release payment
        </button>
      </div>
    </div>
  )
}
