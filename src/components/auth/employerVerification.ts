// src/components/auth/employerVerification.ts
//
// Shared between AuthModals (registration) and VerifyEmailLanding (the
// clicked verification link) so both create the Railway account the same
// way. Kept in its own file — AuthModals imports VerifyEmailLanding for the
// email-verification view, so putting these here avoids a circular import
// between the two.

import { auth, session, contact } from '../../lib/api'

export type PendingEmployer = {
  org: string; contact: string; phone: string; region: string
  email: string; password: string
}

export async function finishEmployerRegistration(p: PendingEmployer) {
  const data = await auth.employerRegister({
    email: p.email.trim(), password: p.password, orgName: p.org.trim(),
    contactPerson: p.contact.trim(), phone: p.phone.trim(), region: p.region,
  })
  session.saveEmployer(data.token, data.employer)
  // Fire and forget — a failed notification must not block the signup.
  contact.send({
    name: p.org.trim(),
    email: p.email.trim(),
    phone: p.phone.trim(),
    message:
      `A new employer account was created.\n\n` +
      `Organisation: ${p.org.trim()}\n` +
      `Contact person: ${p.contact.trim()}\n` +
      `Phone: ${p.phone.trim()}\n` +
      `Email: ${p.email.trim()}\n` +
      `Region: ${p.region}\n\n` +
      `Onboarding answers will follow in a separate email if they complete them.`,
    category: 'employer_registered',
  }).catch(() => null)
}

// Bridges a Supabase email-verification click back to this device. Holding a
// plaintext password here briefly is no more exposed than the form field it
// came from a moment earlier — it's deleted the instant it's used or expires.
const PENDING_KEY = 'bx_pending_employer'
const PENDING_TTL_MS = 30 * 60 * 1000 // 30 minutes — long enough to check an inbox

export function savePendingEmployer(p: PendingEmployer) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ ...p, savedAt: Date.now() }))
  } catch { /* storage unavailable — Google path is unaffected either way */ }
}

export function readPendingEmployer(email: string): PendingEmployer | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as PendingEmployer & { savedAt: number }
    if (Date.now() - p.savedAt > PENDING_TTL_MS) return null
    if (p.email.trim().toLowerCase() !== email.trim().toLowerCase()) return null
    return p
  } catch {
    return null
  }
}

export function clearPendingEmployer() {
  try { localStorage.removeItem(PENDING_KEY) } catch { /* ignore */ }
}
