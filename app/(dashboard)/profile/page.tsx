import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/profile/profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, plaid_enabled, splitwise_enabled')
    .eq('id', user.id)
    .single()

  const safeProfile = profile ?? {
    display_name: null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
    plaid_enabled: false,
    splitwise_enabled: false,
  }

  return (
    <div className="max-w-md">
      <p className="mb-6 text-sm text-neutral-500">Manage your account and integrations</p>
      <ProfileForm profile={safeProfile} user={{ email: user.email }} />
    </div>
  )
}
