import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { categories, remoteCategories } from '../data'

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-clay-500">
      <span className="h-px w-6 bg-clay-400/60" aria-hidden="true" />
      {children}
    </span>
  )
}

export default function WorkerCategories() {
  const { ref, visible } = useReveal()
  const [featured, ...rest] = categories

  return (
    <section id="workers" ref={ref} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
            What our workers do
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            Certified across{' '}
            <span className="italic gradient-text">every category</span>
          </h2>
          <p className="mt-4 text-lg text-ink-700 text-pretty">
            Workers are certified and matched to employer needs throughout
            Ghana &mdash; on site or remote.
          </p>
        </div>

        {/* On the field — one featured tile up top, then a clean 3x2 grid
            beneath it. Seven items never divide evenly into a grid, so rather
            than leave one tile stranded on its own row, the odd one out
            becomes the lead. */}
        <div className="mt-16">
          <SectionLabel>On the field</SectionLabel>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="img-zoom group relative overflow-hidden rounded-2xl"
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="aspect-[16/9] w-full object-cover sm:aspect-[21/9]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cream-50/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-cream-50/25 group-hover:scale-110">
                <featured.icon size={22} className="text-cream-50" />
              </div>
              <h3 className="font-serif text-2xl font-semibold text-cream-50 sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-cream-200/85 text-pretty sm:text-base">
                {featured.description}
              </p>
            </div>
          </motion.div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((cat, i) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + (i % 3) * 0.08 }}
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

        {/* Remote — matched to the same card shape and rhythm as the field
            grid (rounded tile, icon, title, description) so the two halves
            read as one deliberate system rather than a grid plus a bolted-on
            list. A solid brand panel stands in for a photo, since these are
            desk-based roles rather than job sites. Six items split evenly
            into two rows of three — no orphan tile here either. */}
        <div className="mt-20">
          <SectionLabel>Remote</SectionLabel>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {remoteCategories.map((cat, i) => {
              const Icon = cat.icon
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="group overflow-hidden rounded-2xl bg-cream-50 shadow-sm ring-1 ring-ink-900/5 transition-shadow hover:shadow-md"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-forest-700 to-ink-900">
                    <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" aria-hidden="true" />
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cream-50/10 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Icon size={26} className="text-cream-50" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-serif text-lg font-semibold text-ink-900">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-700 text-pretty">
                      {cat.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
