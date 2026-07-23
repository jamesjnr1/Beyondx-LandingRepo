// api/contact.js
//
// Receives contact enquiries and post-registration onboarding answers, then
// emails them to BeyondX via Resend.
//
// ESM: this project sets "type": "module" in package.json, so /api files must
// use `export default`, not module.exports.
//
// Required environment variable:
//   RESEND_API_KEY   from resend.com → API Keys
//
// Optional:
//   CONTACT_TO       destination inbox (defaults to beyondx26@gmail.com)
//   CONTACT_FROM     verified sender. Until you verify a domain in Resend, the
//                    shared sender below works for testing.

const DEFAULT_TO = 'beyondx26@gmail.com'
const DEFAULT_FROM = 'BeyondX <onboarding@resend.dev>'

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set')
    return res.status(500).json({ error: 'Email is not configured on the server (RESEND_API_KEY missing).' })
  }

  // Vercel usually parses JSON bodies; fall back for safety.
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  const { name, email, phone, message, category } = body || {}

  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: 'A message is required.' })
  }

  const label = category === 'worker_onboarding'
    ? 'New worker signup'
    : category === 'employer_onboarding'
      ? 'New employer signup'
      : 'Website enquiry'

  const subject = `${label}${name ? ` — ${name}` : ''}`

  const lines = [
    ['Type', category || 'contact'],
    ['Name', name],
    ['Email', email],
    ['Phone', phone],
  ].filter(([, v]) => v)

  const html = `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#12180E;line-height:1.6;">
      <h2 style="margin:0 0 12px;color:#6BAB21;">${escapeHtml(label)}</h2>
      <table style="border-collapse:collapse;margin-bottom:16px;">
        ${lines.map(([k, v]) => `<tr>
          <td style="padding:4px 14px 4px 0;color:#6b7280;font-size:13px;">${escapeHtml(k)}</td>
          <td style="padding:4px 0;font-size:13px;font-weight:600;">${escapeHtml(v)}</td>
        </tr>`).join('')}
      </table>
      <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;background:#f6f7f4;padding:14px;border-radius:8px;margin:0;">${escapeHtml(message)}</pre>
    </div>`

  const text = [
    label,
    ...lines.map(([k, v]) => `${k}: ${v}`),
    '',
    message,
  ].join('\n')

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        subject,
        html,
        text,
        ...(email ? { reply_to: email } : {}),
      }),
    })

    const detail = await r.text()
    if (!r.ok) {
      console.error('[contact] Resend responded', r.status, detail.slice(0, 300))
      return res.status(502).json({ error: `Email provider rejected the message (${r.status}).` })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[contact] send failed:', err.message)
    return res.status(500).json({ error: 'Could not send the message. Please try again.' })
  }
}
