import { useState, type ReactNode } from 'react'
import { ChevronLeft, Star, Send, CheckCircle2, Users, Truck, ClipboardCheck } from 'lucide-react'
import DashboardHeader from './DashboardHeader'
import { categories } from '../data'

type Worker = { id: number; name: string; initials: string; rank: 'Gold' | 'Silver' | 'Bronze'; rating: number; jobs: number }
type Dispatch = { id: number; worker: string; category: string; date: string; status: 'Dispatched' | 'In progress' | 'Completed' }

const WORKERS: Worker[] = [
  { id: 1, name: 'Kofi Asante', initials: 'KA', rank: 'Gold', rating: 5, jobs: 48 },
  { id: 2, name: 'Yaw Boateng', initials: 'YB', rank: 'Silver', rating: 4, jobs: 23 },
  { id: 3, name: 'Ama Serwaa', initials: 'AS', rank: 'Silver', rating: 5, jobs: 31 },
  { id: 4, name: 'Kwesi Owusu', initials: 'KO', rank: 'Bronze', rating: 4, jobs: 9 },
]
const INITIAL_DISPATCH: Dispatch[] = [
  { id: 100, worker: 'Kofi Asante', category: 'Logistics & Moving', date: 'Yesterday', status: 'Completed' },
  { id: 101, worker: 'Ama Serwaa', category: 'Landscaping & Cleaning', date: '3 days ago', status: 'In progress' },
]

const rankStyle: Record<Worker['rank'], string> = {
  Gold: 'bg-amber-100 text-amber-700',
  Silver: 'bg-ink-900/10 text-ink-700',
  Bronze: 'bg-orange-100 text-orange-700',
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

export default function EmployerDashboard() {
  const [tab, setTab] = useState<'hire' | 'history'>('hire')
  const [category, setCategory] = useState<string | null>(null)
  const [dispatches, setDispatches] = useState<Dispatch[]>(INITIAL_DISPATCH)
  const [justSent, setJustSent] = useState<number | null>(null)

  const dispatch = (w: Worker) => {
    setDispatches((d) => [{ id: Date.now(), worker: w.name, category: category!, date: 'Just now', status: 'Dispatched' }, ...d])
    setJustSent(w.id)
    setTimeout(() => setJustSent(null), 2000)
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <DashboardHeader role="EMPLOYER" title="Employer Dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat icon={<Truck size={20} />} label="Active dispatches" value={`${dispatches.filter((d) => d.status !== 'Completed').length}`} />
          <Stat icon={<Users size={20} />} label="Workers available" value={`${WORKERS.length}`} />
          <Stat icon={<ClipboardCheck size={20} />} label="Total dispatched" value={`${dispatches.length}`} />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto border-b border-ink-900/10 pb-px">
          {([['hire', 'Hire Workers'], ['history', `Dispatch History (${dispatches.length})`]] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${tab === id ? 'border-forest-600 text-forest-700' : 'border-transparent text-ink-700 hover:text-ink-900'}`}>
              {label}
            </button>
          ))}
        </div>

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

        {tab === 'hire' && category && (
          <div className="mt-6">
            <button onClick={() => setCategory(null)} className="mb-4 flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-forest-600">
              <ChevronLeft size={16} /> Back to categories
            </button>
            <h2 className="mb-1 font-serif text-xl font-medium text-ink-900">Available workers</h2>
            <p className="mb-4 text-sm text-ink-700">Verified workers for <span className="font-medium text-ink-900">{category}</span></p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {WORKERS.map((w) => (
                <div key={w.id} className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-cream-50">{w.initials}</span>
                    <div className="min-w-0">
                      <p className="truncate font-serif text-base font-medium text-ink-900">{w.name}</p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-700">
                        <span className={`rounded-full px-2 py-0.5 font-medium ${rankStyle[w.rank]}`}>{w.rank}</span>
                        <span className="inline-flex items-center gap-0.5"><Star size={12} className="fill-forest-600 text-forest-600" /> {w.rating}.0</span>
                        <span>· {w.jobs} jobs</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => dispatch(w)} disabled={justSent === w.id}
                    className="flex shrink-0 items-center gap-1.5 rounded-full bg-forest-600 px-4 py-2 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500 active:scale-[0.98] disabled:bg-forest-700">
                    {justSent === w.id ? <><CheckCircle2 size={16} /> Sent</> : <><Send size={15} /> Dispatch</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="mt-6 space-y-3">
            {dispatches.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 p-4 shadow-sm ring-1 ring-ink-900/5 sm:p-5">
                <div>
                  <p className="font-serif text-base font-medium text-ink-900">{d.worker}</p>
                  <p className="mt-0.5 text-sm text-ink-700">{d.category} · {d.date}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  d.status === 'Completed' ? 'bg-forest-600/10 text-forest-700'
                  : d.status === 'In progress' ? 'bg-amber-100 text-amber-700'
                  : 'bg-ink-900/10 text-ink-700'}`}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
