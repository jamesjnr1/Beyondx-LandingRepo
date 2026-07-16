import { useState, type ReactNode } from 'react'
import { MapPin, Calendar, Check, X, Star, Award, RotateCcw, MessageSquare } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import ReferralCard from '../components/ReferralCard'

type Task = { id: number; title: string; category: string; location: string; pay: number; date: string; employer: string }
type Review = { stars: number; comment: string }
type Done = Task & { rating: number; myReview?: Review }

const INITIAL_AVAILABLE: Task[] = [
  { id: 1, title: 'Warehouse stock sorting', category: 'Logistics & Delivery', location: 'Tema', pay: 120, date: 'Tomorrow · 8:00 AM', employer: 'Tema Port Logistics' },
  { id: 2, title: 'Office cleaning', category: 'Facility & Cleaning', location: 'Osu, Accra', pay: 80, date: 'Wed · 9:00 AM', employer: 'Osu Business Hub' },
  { id: 3, title: 'Painting & touch-up work', category: 'Maintenance & Repairs', location: 'East Legon', pay: 150, date: 'Thu · 7:30 AM', employer: 'GreenBuild Contractors' },
  { id: 4, title: 'Chair & table setup', category: 'Event & Hospitality', location: 'Airport City', pay: 100, date: 'Sat · 2:00 PM', employer: 'Accra Events Co.' },
]
const INITIAL_HISTORY: Done[] = [
  { id: 9, title: 'Goods offloading — Tema Port', category: 'Logistics & Delivery', location: 'Tema Port', pay: 110, rating: 5, date: 'Last week', employer: 'Tema Port Logistics' },
  { id: 10, title: 'School compound sweeping', category: 'Community Services', location: 'Madina', pay: 70, rating: 4, date: '2 weeks ago', employer: 'Ga East Assembly' },
]

const cedis = (n: number) => `GH\u20b5 ${n.toLocaleString()}`

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= n ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20'} />
      ))}
    </span>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)} className="transition-transform active:scale-90">
          <Star size={30} className={i <= value ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20 hover:text-forest-600/40'} />
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

export default function WorkerDashboard() {
  const [tab, setTab] = useState<'available' | 'mine' | 'declined' | 'history'>('available')
  const [available, setAvailable] = useState<Task[]>(INITIAL_AVAILABLE)
  const [mine, setMine] = useState<Task[]>([])
  const [declined, setDeclined] = useState<Task[]>([])
  const [history, setHistory] = useState<Done[]>(INITIAL_HISTORY)
  const [reviewing, setReviewing] = useState<Done | null>(null)

  const accept = (t: Task) => { setAvailable((a) => a.filter((x) => x.id !== t.id)); setMine((m) => [t, ...m]) }
  const decline = (t: Task) => { setAvailable((a) => a.filter((x) => x.id !== t.id)); setDeclined((d) => [t, ...d]) }
  const reconsider = (t: Task) => { setDeclined((d) => d.filter((x) => x.id !== t.id)); setAvailable((a) => [t, ...a]) }
  const complete = (t: Task) => {
    setMine((m) => m.filter((x) => x.id !== t.id))
    setHistory((h) => [{ ...t, rating: 5, date: 'Just now' }, ...h])
  }
  const saveReview = (stars: number, comment: string) => {
    if (!reviewing) return
    setHistory((h) => h.map((x) => (x.id === reviewing.id ? { ...x, myReview: { stars, comment } } : x)))
    setReviewing(null)
  }

  const tabs = [
    { id: 'available', label: `Available (${available.length})` },
    { id: 'mine', label: `My Tasks (${mine.length})` },
    { id: 'declined', label: `Declined (${declined.length})` },
    { id: 'history', label: `History (${history.length})` },
  ] as const

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader role="WORKER" title="Worker Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={<Award size={20} />} label="Current rank" value="Bronze" />
          <Stat icon={<img src="/icons/tasks.png" alt="" className="h-5 w-5 object-contain" />} label="Tasks completed" value={`${history.length + 10}`} />
          <Stat icon={<img src="/icons/wallet.png" alt="" className="h-5 w-5 object-contain" />} label="Total earned" value={cedis(1240)} />
        </div>

        <ReferralCard code="BX-W4Q7K" referrals={3} />

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-ink-900/10 pb-px">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? 'border-forest-600 text-forest-700' : 'border-transparent text-ink-700 hover:text-ink-900'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {tab === 'available' && (available.length ? available.map((t) => (
            <div key={t.id} className="flex flex-col gap-4 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="min-w-0">
                <span className="mb-1 inline-block rounded-full bg-forest-600/10 px-2.5 py-0.5 text-xs font-medium text-forest-700">{t.category}</span>
                <h3 className="font-serif text-lg font-medium text-ink-900">{t.title}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-700">
                  <span className="inline-flex items-center gap-1"><MapPin size={14} /> {t.location}</span>
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {t.date}</span>
                  <span className="font-semibold text-ink-900">{cedis(t.pay)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-700">Employer · <span className="font-medium text-ink-900">{t.employer}</span></p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => accept(t)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] sm:flex-none">
                  <Check size={16} /> Accept
                </button>
                <button onClick={() => decline(t)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5 active:scale-[0.98] sm:flex-none">
                  <X size={16} /> Decline
                </button>
              </div>
            </div>
          )) : <Empty text="No available tasks right now. Check back soon." />)}

          {tab === 'mine' && (mine.length ? mine.map((t) => (
            <div key={t.id} className="flex flex-col gap-4 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <span className="mb-1 inline-block rounded-full bg-forest-600/10 px-2.5 py-0.5 text-xs font-medium text-forest-700">{t.category}</span>
                <h3 className="font-serif text-lg font-medium text-ink-900">{t.title}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-700">
                  <span className="inline-flex items-center gap-1"><MapPin size={14} /> {t.location}</span>
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {t.date}</span>
                  <span className="font-semibold text-ink-900">{cedis(t.pay)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-700">Employer · <span className="font-medium text-ink-900">{t.employer}</span></p>
              </div>
              <button onClick={() => complete(t)} className="shrink-0 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98]">
                Mark Complete
              </button>
            </div>
          )) : <Empty text="You haven't accepted any tasks yet." />)}

          {tab === 'declined' && (declined.length ? declined.map((t) => (
            <div key={t.id} className="flex flex-col gap-4 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <span className="mb-1 inline-block rounded-full bg-ink-900/5 px-2.5 py-0.5 text-xs font-medium text-ink-700">{t.category}</span>
                <h3 className="font-serif text-lg font-medium text-ink-900">{t.title}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-700">
                  <span className="inline-flex items-center gap-1"><Calendar size={14} /> {t.date}</span>
                  <span className="font-semibold text-ink-900">{cedis(t.pay)}</span>
                  <span>· {t.employer}</span>
                </div>
              </div>
              <button onClick={() => reconsider(t)} className="flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-forest-600/40 px-4 py-2 text-sm font-medium text-forest-700 transition-colors hover:bg-forest-600/5 active:scale-[0.98]">
                <RotateCcw size={15} /> Move back to available
              </button>
            </div>
          )) : <Empty text="You haven't declined any tasks." />)}

          {tab === 'history' && (history.length ? history.map((t) => (
            <div key={t.id} className="rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="mb-1 inline-block rounded-full bg-ink-900/5 px-2.5 py-0.5 text-xs font-medium text-ink-700">{t.category}</span>
                  <h3 className="font-serif text-lg font-medium text-ink-900">{t.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-700">{t.employer} · {t.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-right">
                    <span className="block text-xs text-ink-700">Employer rated you</span>
                    <Stars n={t.rating} />
                  </span>
                  <span className="font-semibold text-ink-900">{cedis(t.pay)}</span>
                </div>
              </div>
              <div className="mt-3 border-t border-ink-900/10 pt-3">
                {t.myReview ? (
                  <div className="flex items-center gap-2 text-sm text-ink-700">
                    <span>You reviewed {t.employer}:</span> <Stars n={t.myReview.stars} />
                  </div>
                ) : (
                  <button onClick={() => setReviewing(t)} className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-600">
                    <MessageSquare size={15} /> Review this employer
                  </button>
                )}
              </div>
            </div>
          )) : <Empty text="No completed tasks yet." />)}
        </div>
      </main>

      {reviewing && <ReviewModal employer={reviewing.employer} onClose={() => setReviewing(null)} onSave={saveReview} />}
    </div>
  )
}

function ReviewModal({ employer, onClose, onSave }: { employer: string; onClose: () => void; onSave: (stars: number, comment: string) => void }) {
  const [stars, setStars] = useState(5)
  const [comment, setComment] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-cream-50 p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-serif text-xl font-medium text-ink-900">Review employer</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-700 hover:bg-ink-900/5"><X size={18} /></button>
        </div>
        <p className="mb-4 text-sm text-ink-700">How was your experience working with <span className="font-medium text-ink-900">{employer}</span>?</p>
        <StarPicker value={stars} onChange={setStars} />
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Share how you were treated, paid, and managed (optional)"
          className="mt-4 w-full rounded-xl border border-ink-900/15 bg-white p-3 text-sm text-ink-900 outline-none focus:border-forest-600" />
        <button onClick={() => onSave(stars, comment)} className="mt-4 w-full rounded-full bg-forest-600 px-6 py-3 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98]">
          Submit review
        </button>
      </div>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-700">{text}</div>
}
