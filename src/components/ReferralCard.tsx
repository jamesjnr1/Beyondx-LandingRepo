import { useState } from 'react'
import { Gift, Copy, Check } from 'lucide-react'

const REWARD = 20

export default function ReferralCard({ code, referrals = 0 }: { code: string; referrals?: number }) {
  const [copied, setCopied] = useState(false)
  const link = `beyondxco.com/join?ref=${code}`
  const earned = referrals * REWARD

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${link}`)
    } catch {
      /* clipboard unavailable — link is still visible to copy manually */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl bg-forest-700 text-cream-50 shadow-sm">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="max-w-md">
          <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cream-50/15 px-3 py-1 text-xs font-medium">
            <Gift size={14} /> Refer &amp; Earn
          </span>
          <h3 className="font-serif text-2xl font-medium leading-tight">
            Earn GH&#8373;20.00 for every person you bring to BeyondX.
          </h3>
          <p className="mt-1.5 text-sm text-cream-50/80">
            Share your link. When they sign up and get verified, GH&#8373;20.00 is added to your earnings.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span><span className="font-semibold">{referrals}</span> <span className="text-cream-50/70">referrals</span></span>
            <span><span className="font-semibold">GH&#8373; {earned.toLocaleString()}</span> <span className="text-cream-50/70">earned</span></span>
          </div>
        </div>

        <div className="w-full shrink-0 sm:w-auto">
          <span className="mb-2 block text-xs uppercase tracking-wide text-cream-50/60">Your referral link</span>
          <div className="flex items-center gap-2 rounded-xl bg-cream-50/10 p-2 ring-1 ring-cream-50/20">
            <span className="min-w-0 flex-1 truncate px-2 text-sm font-medium sm:max-w-[15rem]">{link}</span>
            <button onClick={copy}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-cream-50 px-3 py-2 text-sm font-semibold text-forest-700 transition-all hover:bg-white active:scale-[0.97]">
              {copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
