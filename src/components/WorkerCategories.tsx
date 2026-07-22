import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { categories } from '../data'

export default function WorkerCategories() {
  const { ref, visible } = useReveal()

  return (
    <section id="workers" ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
            Available Task Categories
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            What our{' '}
            <span className="italic gradient-text">workers do.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-700 text-pretty">
            Workers are certified across seven categories and matched to
            employer needs across Greater Accra.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={visible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="img-zoom group relative overflow-hidden rounded-2xl"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cream-50/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-cream-50/25 group-hover:scale-110">
                    <Icon size={20} className="text-cream-50" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-cream-50">
                    {cat.title}
                  </h3>
                  <ul className="mt-2 space-y-0.5">
                    {cat.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-1.5 text-sm leading-snug text-cream-200/85">
                        <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-forest-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
