import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'

const blocks = [
  {
    eyebrow: 'About the Programme',
    title: 'Work that restores dignity. Hire that builds trust.',
    body: 'BeyondX is a structured second-chance employment programme. It places vetted, skill-matched workers who are rebuilding their lives after release into verified short-term roles with responsible employers across Greater Accra.',
    image: '/about.jpg',
    alt: 'Certified workers in safety harnesses on a construction site in Greater Accra',
  },
  {
    eyebrow: 'How we work',
    title: 'Every worker certified. Every shift GPS-verified.',
    body: 'Every worker completes skills certification and carries a digital work record tracked in real time. Every employer receives GPS-verified attendance logs and dedicated coordinator support.',
    image: 'https://images.pexels.com/photos/8961342/pexels-photo-8961342.jpeg?auto=compress&cs=tinysrgb&w=1200',
    alt: 'Workers collaborating on site',
    reverse: true,
  },
]

export default function About() {
  const { ref, visible } = useReveal()

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl space-y-24 px-5 sm:px-8 sm:space-y-32">
        {blocks.map((block, i) => (
          <div
            key={i}
            className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
              block.reverse ? 'lg:[&>div:first-child]:order-2' : ''
            }`}
          >
            <motion.div
              initial={{ opacity: 0, x: block.reverse ? 30 : -30 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
                {block.eyebrow}
              </span>
              <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
                {block.title.split(' ').map((word, wi) => (
                  <span key={wi}>
                    {wi === Math.floor(block.title.split(' ').length / 2) ? (
                      <span className="italic gradient-text">{word} </span>
                    ) : (
                      <>{word} </>
                    )}
                  </span>
                ))}
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-700 text-pretty">
                {block.body}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: block.reverse ? -30 : 30 }}
              animate={visible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 + 0.15 }}
              className="img-zoom relative overflow-hidden rounded-2xl"
            >
              <img
                src={block.image}
                alt={block.alt}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        ))}

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl rounded-2xl border border-ink-900/8 bg-cream-100 p-8 text-center sm:p-12"
        >
          <span aria-hidden="true" className="font-serif text-5xl leading-none text-clay-400/50">&ldquo;</span>
          <blockquote className="mt-2 font-serif text-xl font-medium leading-relaxed text-ink-900 text-pretty sm:text-2xl">
            Before BeyondX, I had skills but no platform. Now I have a work record,
            a wage, and employers who call me back.
          </blockquote>
          <figcaption className="mt-5 text-sm font-semibold uppercase tracking-wider text-clay-500">
            — Kofi A., BX-00142 · Facility Cleaning Specialist
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
