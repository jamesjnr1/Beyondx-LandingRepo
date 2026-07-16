import { useState, type ReactNode } from 'react'
import { MapPin, Calendar, Check, X, Star, Award, Briefcase, Wallet } from 'lucide-react'
import DashboardHeader from './DashboardHeader'

type Task = { id: number; title: string; category: string; location: string; pay: number; date: string }
type Done = { id: number; title: string; category: string; pay: number; rating: number; date: string }

const INITIAL_AVAILABLE: Task[] = [
  { id: 1, title: 'Warehouse stock sorting', category: 'Logistics & Delivery', location: 'Tema', pay: 120, date: 'Tomorrow · 8:00 AM' },
  { id: 2, title: 'Office cleaning', category: 'Facility & Cleaning', location: 'Osu, Accra', pay: 80, date: 'Wed · 9:00 AM' },
  { id: 3, title: 'Painting & touch-up work', category: 'Maintenance & Repairs', location: 'East Legon', pay: 150, date: 'Thu · 7:30 AM' },
  { id: 4, title: 'Chair & table setup', category: 'Event & Hospitality', location: 'Airport City', pay: 100, date: 'Sat · 2:00 PM' },
]
const INITIAL_HISTORY: Done[] = [
  { id: 9, title: 'Goods offloading — Tema Port', category: 'Logistics & Delivery', pay: 110, rating: 5, date: 'Last week' },
  { id: 10, title: 'School compound sweeping', category: 'Community Services', pay: 70, rating: 4, date: '2 weeks ago' },
]

const cedis = (n: number) => `GH\u20b5 ${n.toLocaleString()}`

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= n ? 'fill-forest-600 text-forest-600' : 'text-ink-900/20'} />
      ))}
    </span>
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
  const [tab, setTab] = useState<'available' | 'mine' | 'history'>('available')
  const [available, setAvailable] = useState<Task[]>(INITIAL_AVAILABLE)
  const [mine, setMine] = useState<Task[]>([])
  const [history, setHistory] = useState<Done[]>(INITIAL_HISTORY)

  const accept = (t: Task) => { setAvailable((a) => a.filter((x) => x.id !== t.id)); setMine((m) => [t, ...m]) }
  const decline = (id: number) => setAvailable((a) => a.filter((x) => x.id !== id))
  const complete = (t: Task) => {
    setMine((m) => m.filter((x) => x.id !== t.id))
    setHistory((h) => [{ id: t.id, title: t.title, category: t.category, pay: t.pay, rating: 5, date: 'Just now' }, ...h])
  }

  const tabs = [
    { id: 'available', label: `Available (${available.length})` },
    { id: 'mine', label: `My Tasks (${mine.length})` },
    { id: 'history', label: `History (${history.length})` },
  ] as const

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader role="WORKER" title="Worker Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={<Award size={20} />} label="Current rank" value="Bronze" />
          <Stat icon={<Briefcase size={20} />} label="Tasks completed" value={`${history.length + 10}`} />
          <Stat icon={<Wallet size={20} />} label="Total earned" value={cedis(1240)} />
        </div>

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
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => accept(t)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] sm:flex-none">
                  <Check size={16} /> Accept
                </button>
                <button onClick={() => decline(t.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5 active:scale-[0.98] sm:flex-none">
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
              </div>
              <button onClick={() => complete(t)} className="shrink-0 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98]">
                Mark Complete
              </button>
            </div>
          )) : <Empty text="You haven't accepted any tasks yet." />)}

          {tab === 'history' && (history.length ? history.map((t) => (
            <div key={t.id} className="flex flex-col gap-2 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div>
                <span className="mb-1 inline-block rounded-full bg-ink-900/5 px-2.5 py-0.5 text-xs font-medium text-ink-700">{t.category}</span>
                <h3 className="font-serif text-lg font-medium text-ink-900">{t.title}</h3>
                <p className="mt-0.5 text-sm text-ink-700">{t.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <Stars n={t.rating} />
                <span className="font-semibold text-ink-900">{cedis(t.pay)}</span>
              </div>
            </div>
          )) : <Empty text="No completed tasks yet." />)}
        </div>
      </main>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-700">{text}</div>
}
