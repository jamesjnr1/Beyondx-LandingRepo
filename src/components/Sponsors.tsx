import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'

const tiers = [
  {
    name: 'Seed Sponsor',
    amount: 'GHS 800',
    description: 'Fund the certification of one worker — tools, training, and orientation.',
  },
  {
    name: 'Growth Partner',
    amount: 'Cohort of 5',
    description: 'Sponsor a cohort of five workers. Named co-branding and a quarterly impact report.',
  },
  {
    name: 'Anchor Partner',
    amount: 'Co-ownership',
    description: 'Full programme co-ownership with board observer seat and national PR partnership.',
  },
]

export default function Sponsors() {
  const { ref, visible } = useReveal()

  return (
    <section id="sponsors" ref={ref} className="relative bg-cream-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
            For Sponsors &amp; Partners
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            Join the{' '}
            <span className="italic gradient-text">Movement.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-700 text-pretty">
            BeyondX runs on belief — belief that people rebuilding their lives after
            release can be contributors, not just statistics.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col rounded-2xl border border-ink-900/8 bg-cream-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-clay-500">{t.name}</span>
              <span className="mt-3 font-serif text-3xl font-medium text-ink-900">{t.amount}</span>
              <p className="mt-4 text-sm leading-relaxed text-ink-700">{t.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
