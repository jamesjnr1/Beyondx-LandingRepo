import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'

export default function Team() {
  const { ref, visible } = useReveal()

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
              The team
            </span>
            <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl">
              Built by students who believe in{' '}
              <span className="italic gradient-text">second chances</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-700 text-pretty">
              BeyondX was designed and built by eleven students at Ashesi
              University, driven by the belief that technology can be a genuine
              force for justice and second chances.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="img-zoom relative overflow-hidden rounded-2xl"
          >
            <img
              src="https://images.pexels.com/photos/7149172/pexels-photo-7149172.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Team of students collaborating"
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
