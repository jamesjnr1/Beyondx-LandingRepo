import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { CircleCheck as CheckCircle } from 'lucide-react'

const employerPoints = [
  'Post short-term tasks or dispatch a specific worker directly',
  'GPS-verified attendance logs for every shift',
  'Secure mobile money payments handled through the platform',
  'Dedicated coordinator support at every step',
]

const workerPoints = [
  'Skills certification and a digital work record — yours to keep',
  'Fair, transparent pricing with 85% paid directly to you',
  'Every employer agrees to treat you with dignity',
  'Build a verified reputation that opens doors',
]

export default function Transparency() {
  const { ref, visible } = useReveal()

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
            Transparency on both sides
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            Clear commitments to every{' '}
            <span className="italic gradient-text">employer and worker</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-ink-900/8 bg-cream-50 p-8 shadow-sm"
          >
            <h3 className="mb-6 font-serif text-xl font-semibold text-ink-900">
              For employers
            </h3>
            <ul className="space-y-4">
              {employerPoints.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -15 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="mt-0.5 shrink-0 text-forest-600" />
                  <span className="text-sm leading-relaxed text-ink-700">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-2xl border border-ink-900/8 bg-cream-50 p-8 shadow-sm"
          >
            <h3 className="mb-6 font-serif text-xl font-semibold text-ink-900">
              For workers
            </h3>
            <ul className="space-y-4">
              {workerPoints.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: 15 }}
                  animate={visible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={20} className="mt-0.5 shrink-0 text-clay-500" />
                  <span className="text-sm leading-relaxed text-ink-700">{point}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-10 max-w-3xl rounded-xl border border-clay-400/30 bg-clay-400/8 p-5 text-center"
        >
          <p className="text-sm leading-relaxed text-ink-700 text-pretty">
            <span className="font-semibold text-clay-600">Important:</span> All
            individuals on this platform are participants in BeyondX's
            second-chance employment programme, vetted directly by our team.
            Candidates have served their sentences in full and are legally
            recognised as having fulfilled their debt to society.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
