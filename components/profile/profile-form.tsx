'use client'

import { useState, useTransition } from 'react'
import { updateProfile, signOut } from '@/app/actions/auth'

type Profile = {
  display_name: string | null
  avatar_url: string | null
  plaid_enabled: boolean
  splitwise_enabled: boolean
}

type User = {
  email: string | undefined
}

export default function ProfileForm({ profile, user }: { profile: Profile; user: User }) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [plaid, setPlaid] = useState(profile.plaid_enabled)
  const [splitwise, setSplitwise] = useState(profile.splitwise_enabled)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleToggle(field: 'plaid' | 'splitwise') {
    const next = field === 'plaid' ? !plaid : !splitwise
    if (field === 'plaid') setPlaid(next)
    else setSplitwise(next)

    startTransition(async () => {
      await updateProfile({
        plaid_enabled: field === 'plaid' ? next : plaid,
        splitwise_enabled: field === 'splitwise' ? next : splitwise,
      })
    })
  }

  function handleSaveName() {
    startTransition(async () => {
      await updateProfile({ display_name: displayName })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="space-y-6">
      {/* Identity */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Account</h2>
        <div className="flex items-center gap-4 mb-6">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Profile picture"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-neutral-200"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-xl font-medium text-neutral-600">
              {(displayName || user.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-neutral-900">{displayName || user.email}</p>
            <p className="text-xs text-neutral-500">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setSaved(false) }}
            placeholder="Display name"
            className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
          <button
            onClick={handleSaveName}
            disabled={isPending}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
          >
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Integrations</h2>
        <div className="space-y-4">
          <Toggle
            label="Plaid"
            description="Connect your bank accounts for automatic transaction import"
            enabled={plaid}
            onToggle={() => handleToggle('plaid')}
            badge="Bank sync"
          />
          <div className="border-t border-neutral-100" />
          <Toggle
            label="Splitwise"
            description="Sync shared expenses and balances from Splitwise"
            enabled={splitwise}
            onToggle={() => handleToggle('splitwise')}
            badge="Coming soon"
            badgeVariant="muted"
          />
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900">Session</h2>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

function Toggle({
  label,
  description,
  enabled,
  onToggle,
  badge,
  badgeVariant = 'accent',
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
  badge?: string
  badgeVariant?: 'accent' | 'muted'
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-900">{label}</p>
          {badge && (
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                badgeVariant === 'accent'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-neutral-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:ring-offset-2 ${
          enabled ? 'bg-neutral-900' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
