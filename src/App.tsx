import { AuthProvider } from './components/auth/AuthContext'
import AuthModals from './components/auth/AuthModals'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import HowItWorks from './components/HowItWorks'
import WorkerCategories from './components/WorkerCategories'
import Pillars from './components/Pillars'
import Transparency from './components/Transparency'
import Gallery from './components/Gallery'
import SocialGrid from './components/SocialGrid'
import Testimonial from './components/Testimonial'
import Team from './components/Team'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <AuthProvider>
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
          <Testimonial />
          <Team />
          <Gallery />
          <SocialGrid />
          <CTA />
        </main>
        <Footer />
      </div>
      <AuthModals />
    </AuthProvider>
  )
}
