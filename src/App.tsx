import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import HowItWorks from './components/HowItWorks'
import WorkerCategories from './components/WorkerCategories'
import Pillars from './components/Pillars'
import Transparency from './components/Transparency'
import Stories from './components/Stories'
import SocialGrid from './components/SocialGrid'
import Testimonial from './components/Testimonial'
import Team from './components/Team'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-cream-50 text-ink-900">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <HowItWorks />
        <WorkerCategories />
        <Pillars />
        <Transparency />
        <Stories />
        <SocialGrid />
        <Testimonial />
        <Team />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
