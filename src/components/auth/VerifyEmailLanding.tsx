import { useEffect, useState } from 'react'
import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import { supabase } from '../../lib/supabase'
import { ApiError } from '../../lib/api'
import { readPendingEmployer, clearPendingEmployer, finishEmployerRegistration } from './employerVerification'

type Status = 'checking' | 'done' | 'other-device' | 'error'

/**
 * Where a clicked email-verification link lands. Supabase has already
 * confirmed the email by the time anyone sees this — this screen's only job
 * is to pick up the registration details saved on this device and finish
 * creating the actual BeyondX account.
 */
export default function VerifyEmailLanding() {
  const { open, go } = useAuth()
  const [status, setStatus] = useState<Status>('checking')
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    let settled = false

    const finish = async (email: string) => {
      if (settled) return
      settled = true
      try {
        const pending = readPendingEmployer(email)
        if (!pending) {
          if (cancelled) return
          setStatus('other-device')
          return
        }
        await finishEmployerRegistration(pending)
        clearPendingEmployer()
        await supabase?.auth.signOut() // Railway's own token is the session now.
        if (cancelled) return
        setStatus('done')
        window.setTimeout(() => open('employer-onboarding'), 1200)
      } catch (e) {
        if (cancelled) return
        setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Something went wrong.')
        setStatus('error')
      }
    }

    const fail = (message: string) => {
      if (settled || cancelled) return
      settled = true
      setError(message)
      setStatus('error')
    }

    if (!supabase) { fail('Verification is not available right now.'); return }

    // Supabase parses the link's token asynchronously right after the client
    // is created. Racing that with a single immediate getSession() call can
    // catch it mid-flight, so this also listens for the SIGNED_IN event the
    // SDK fires once parsing finishes — whichever resolves first wins.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) finish(session.user.email)
    })

    supabase.auth.getSession().then(({ data, error: sessErr }) => {
      if (sessErr) return
      if (data.session?.user?.email) finish(data.session.user.email)
    })

    const timeout = window.setTimeout(() => {
      fail('That verification link is invalid or has expired.')
    }, 8000)

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
      window.clearTimeout(timeout)
    }
  }, [open])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-cream-50 p-8 text-center shadow-xl">
        {status === 'checking' && (
          <>
            <LoaderCircle size={32} className="mx-auto animate-spin text-forest-600" />
            <p className="mt-4 text-sm text-ink-700">Confirming your email&hellip;</p>
          </>
        )}

        {status === 'done' && (
          <>
            <CircleCheck size={36} className="mx-auto text-forest-600" />
            <h2 className="mt-3 font-serif text-xl font-medium text-ink-900">Email verified</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
              Your account is ready. Taking you in&hellip;
            </p>
          </>
        )}

        {status === 'other-device' && (
          <>
            <CircleCheck size={36} className="mx-auto text-forest-600" />
            <h2 className="mt-3 font-serif text-xl font-medium text-ink-900">Email verified</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700">
              Your email is confirmed. To finish, go back to the device where
              you started registering — or register again here.
            </p>
            <button
              onClick={() => { go('home'); open('employer-register') }}
              className="mt-5 rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-500"
            >
              Register on this device
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <CircleX size={36} className="mx-auto text-red-600" />
            <h2 className="mt-3 font-serif text-xl font-medium text-ink-900">Link didn&rsquo;t work</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{error}</p>
            <button
              onClick={() => { go('home'); open('employer-register') }}
              className="mt-5 rounded-full bg-forest-600 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-forest-500"
            >
              Try registering again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
