import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { categories, remoteCategories } from '../data'

const REMOTE_IMAGES: Record<string, string> = {
  'Data Entry & Digitisation': '/categories/remote/data-entry.jpg',
  'Customer Support': '/categories/remote/customer-support.jpg',
  'Social Media & Content': '/categories/remote/social-media.jpg',
  'Transcription & Translation': '/categories/remote/transcription.jpg',
  'Online Research & Listings': '/categories/remote/research.jpg',
  'Virtual Assistance': '/categories/remote/virtual-assistance.jpg',
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-clay-500">
      <span className="h-px w-6 bg-clay-400/60" aria-hidden="true" />
      {children}
    </span>
  )
}

/** Compact card used in the two-column grids — image, icon badge, title, and a
 *  short description that only appears from `sm:` up. Keeping mobile tiles
 *  small (not full-width) is what actually cuts the scroll length down. */
function CategoryTile({
  image,
  title,
  description,
  Icon,
  delay,
}: {
  image: string
  title: string
  description: string
  Icon: LucideIcon
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.45, delay }}
      className="img-zoom group relative overflow-hidden rounded-xl sm:rounded-2xl"
    >
      <img
        src={image}
        alt={title}
        className="aspect-square w-full object-cover sm:aspect-[4/3]"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent sm:from-ink-950/80 sm:via-ink-950/20" />
      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6">
        <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-cream-50/15 backdrop-blur-sm transition-all duration-300 group-hover:bg-cream-50/25 group-hover:scale-110 sm:mb-3 sm:h-10 sm:w-10 sm:rounded-xl">
          <Icon size={14} className="text-cream-50 sm:hidden" />
          <Icon size={20} className="hidden text-cream-50 sm:block" />
        </div>
        <h3 className="font-serif text-sm font-semibold leading-tight text-cream-50 sm:text-xl">
          {title}
        </h3>
        <p className="mt-1 hidden text-sm leading-relaxed text-cream-200/80 text-pretty sm:block">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

export default function WorkerCategories() {
  const { ref, visible } = useReveal()
  const [featured, ...rest] = categories

  return (
    <section id="workers" ref={ref} className="relative py-16 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500 sm:mb-4">
            What our workers do
          </span>
          <h2 className="font-serif text-2xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            Certified across{' '}
            <span className="italic gradient-text">every category</span>
          </h2>
          <p className="mt-3 text-base text-ink-700 text-pretty sm:mt-4 sm:text-lg">
            Workers are certified and matched to employer needs throughout
            Ghana &mdash; on site or remote.
          </p>
        </div>

        {/* On the field — one featured tile up top, then a compact grid. Seven
            items never divide evenly, so the odd one out becomes the lead
            rather than being stranded alone on its own row. Two columns from
            the base breakpoint keeps this short on a phone instead of forcing
            seven full-width tiles in a row. */}
        <div className="mt-10 sm:mt-16">
          <SectionLabel>On the field</SectionLabel>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="img-zoom group relative overflow-hidden rounded-xl sm:rounded-2xl"
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8">
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-cream-50/15 backdrop-blur-sm sm:mb-3 sm:h-11 sm:w-11 sm:rounded-xl">
                <featured.icon size={18} className="text-cream-50 sm:hidden" />
                <featured.icon size={22} className="hidden text-cream-50 sm:block" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-cream-50 sm:text-2xl lg:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-cream-200/85 text-pretty sm:text-sm lg:text-base">
                {featured.description}
              </p>
            </div>
          </motion.div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-5 lg:grid-cols-3">
            {rest.map((cat, i) => (
              <CategoryTile
                key={cat.title}
                image={cat.image}
                title={cat.title}
                description={cat.description}
                Icon={cat.icon}
                delay={(i % 3) * 0.06}
              />
            ))}
          </div>
        </div>

        {/* Remote — same card system as the field grid, now with real photos
            rather than a solid colour stand-in. Six items split evenly into
            two rows regardless of column count, so there's no orphan tile
            here either. */}
        <div className="mt-10 sm:mt-20">
          <SectionLabel>Remote</SectionLabel>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {remoteCategories.map((cat, i) => (
              <CategoryTile
                key={cat.title}
                image={REMOTE_IMAGES[cat.title] || cat.image}
                title={cat.title}
                description={cat.description}
                Icon={cat.icon}
                delay={(i % 3) * 0.06}
              />
            ))}
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-ink-700/80 sm:mt-6 sm:text-sm">
            These are the categories we support today. As BeyondX grows, more
            will be added based on demand from workers and employers.
          </p>
        </div>
      </div>
    </section>
  )
}
