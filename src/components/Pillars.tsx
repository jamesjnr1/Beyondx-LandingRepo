import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { pillars } from '../data'

export default function Pillars() {
  const { ref, visible } = useReveal()

  return (
    <section
      id="principles"
      ref={ref}
      className="relative overflow-hidden bg-ink-900 py-24 grain sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-300">
            Our principles
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-cream-50 text-balance sm:text-4xl lg:text-5xl">
            Built on{' '}
            <span className="italic gradient-text">three pillars</span>
          </h2>
          <p className="mt-4 text-lg text-cream-200/70 text-pretty">
            Every decision in BeyondX is shaped by these principles.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="h-full rounded-2xl border border-cream-50/10 bg-cream-50/5 p-8 text-center transition-all duration-300 hover:border-forest-400/30 hover:bg-cream-50/10"
            >
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 shadow-lg shadow-forest-900/40">
                <span className="font-serif text-xl font-bold text-cream-50">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-3 font-serif text-2xl font-medium text-cream-50">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream-200/70 text-pretty">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
