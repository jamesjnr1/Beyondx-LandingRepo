import Hero from '../components/Hero'
import Stats from '../components/Stats'
import About from '../components/About'
import HowItWorks from '../components/HowItWorks'
import WorkerCategories from '../components/WorkerCategories'
import Pillars from '../components/Pillars'
import Transparency from '../components/Transparency'
import Testimonial from '../components/Testimonial'
import News from '../components/News'
import SocialGrid from '../components/SocialGrid'
import Sponsors from '../components/Sponsors'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <About />
      <HowItWorks />
      <WorkerCategories />
      <Pillars />
      <Transparency />
      <Sponsors />
      <Testimonial />
      <News />
      <div className="bg-cream-100">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 sm:px-8">
          <div className="h-px flex-1 bg-ink-900/10" />
          <span className="h-1.5 w-1.5 rounded-full bg-forest-600/50" />
          <div className="h-px flex-1 bg-ink-900/10" />
        </div>
      </div>
      <SocialGrid />
      <CTA />
    </>
  )
}
