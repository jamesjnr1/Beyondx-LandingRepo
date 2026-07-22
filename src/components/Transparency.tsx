import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { CircleCheck as CheckCircle } from 'lucide-react'

const employerPoints = [
  'Candidates have served their sentences in full and are legally recognised as having fulfilled their debt to society',
  'You are hiring a vetted, work-ready individual assessed as fit for employment',
  'Hiring through this platform may qualify your business for government tax incentives',
  'All job completions are tracked and recorded through the platform',
]

const workerPoints = [
  'You have completed your sentence — this platform helps you write the next chapter through honest work and fair pay',
  'Your criminal history will be disclosed transparently, but your conduct and work record will speak louder over time',
  'You have the right to fair pay, respectful treatment, and to report any employer who treats you unfairly',
  'More completed jobs means a stronger profile and access to better opportunities',
]

export default function Transparency() {
  const { ref, visible } = useReveal()

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
            Our Commitments
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            Transparency on{' '}
            <span className="italic gradient-text">both sides.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-700 text-pretty">
            BeyondX makes clear commitments to every employer and every worker on this platform.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-ink-900/8 bg-cream-50 p-8 shadow-sm"
          >
            <h3 className="mb-6 font-serif text-xl font-semibold text-ink-900">
              For Employers
            </h3>
            <p className="-mt-4 mb-5 text-sm font-medium text-ink-700">
              Important Notice Regarding Our Talent Pool
            </p>
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
              For Workers
            </h3>
            <p className="-mt-4 mb-5 text-sm font-medium text-ink-700">
              Welcome. You Belong Here.
            </p>
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
