// src/lib/config.ts
//
// Platform switches. Change the value, redeploy, done.

/**
 * Dispatch is paused while we build up the employer side of the marketplace.
 * Set this to `true` to turn direct dispatch back on for everyone.
 */
export const DISPATCH_ENABLED = false

/** Shown wherever dispatch would normally be offered. */
export const DISPATCH_PAUSED_MESSAGE =
  'Dispatch opens once enough employers have joined. We are onboarding employers now — you can still post a task, and we will be in touch as soon as dispatch goes live.'
