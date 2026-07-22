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
            What our workers do
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            Seven certified{' '}
            <span className="italic gradient-text">skill categories</span>
          </h2>
          <p className="mt-4 text-lg text-ink-700 text-pretty">
            Workers are certified across these categories and matched to
            employer needs throughout Greater Accra.
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
                  <p className="mt-1 text-sm leading-relaxed text-cream-200/80 text-pretty">
                    {cat.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
