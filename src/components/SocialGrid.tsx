import { motion } from 'framer-motion'
import { useReveal } from '../hooks/useReveal'
import { instagramPosts } from '../data'
import { Instagram, Heart, MessageCircle } from 'lucide-react'

export default function SocialGrid() {
  const { ref, visible } = useReveal()

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-100 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-clay-500">
            Follow us
          </span>
          <h2 className="font-serif text-3xl font-medium leading-tight text-ink-900 text-balance sm:text-4xl lg:text-5xl">
            On the ground,{' '}
            <span className="italic gradient-text">on Instagram</span>
          </h2>
          <p className="mt-4 text-lg text-ink-700 text-pretty">
            Real workers, real job sites, real second chances. Follow our daily work across Greater Accra.
          </p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-all hover:bg-forest-500"
          >
            <Instagram size={16} />
            @beyondx.gh
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={visible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: (i % 6) * 0.08 }}
              className={`img-zoom group relative overflow-hidden rounded-xl ${
                i === 0 ? 'col-span-2 row-span-2 sm:col-span-1 sm:row-span-1' : ''
              }`}
            >
              <img
                src={post.image}
                alt={post.caption}
                className={`w-full object-cover ${
                  i === 0 ? 'aspect-square sm:aspect-square' : 'aspect-square'
                }`}
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink-950/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="text-xs leading-snug text-cream-50 text-pretty">
                  {post.caption}
                </p>
                <div className="mt-2 flex items-center gap-3 text-cream-200/90">
                  <span className="inline-flex items-center gap-1 text-xs">
                    <Heart size={12} /> 24
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <MessageCircle size={12} /> 3
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
