// src/components/auth/employerVerification.ts
//
// Creates the actual Railway employer account, once an email is trusted —
// either because Google already verified it, or because a typed one-time
// code from Supabase confirmed it. Kept in its own small file since it's
// used from more than one place.

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
