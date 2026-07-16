import { AuthProvider, useAuth } from './components/auth/AuthContext'
import AuthModals from './components/auth/AuthModals'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import TeamPage from './pages/TeamPage'
import GalleryPage from './pages/GalleryPage'
import WorkerDashboard from './pages/WorkerDashboard'
import EmployerDashboard from './pages/EmployerDashboard'

function Shell() {
  const { page } = useAuth()

  if (page === 'worker-dashboard') return <WorkerDashboard />
  if (page === 'employer-dashboard') return <EmployerDashboard />

  return (
    <div className="relative min-h-screen bg-cream-50 text-ink-900">
      <Navbar />
      <main>
        {page === 'home' && <Home />}
        {page === 'team' && <TeamPage />}
        {page === 'gallery' && <GalleryPage />}
      </main>
      <Footer />
      <AuthModals />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  )
}
