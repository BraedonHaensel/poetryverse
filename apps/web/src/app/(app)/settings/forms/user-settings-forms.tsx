import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { isAdmin, UserData } from '@/lib/user-requests'

import { AdvancedSettingsForm } from './advanced-settings-form'
import { EmailForm } from './email-form'
import { ProfilePictureForm } from './profile-picture-form'
import { UsernameForm } from './username-form'

/**
 * Collection of all user settings forms used by both mobile and desktop.
 */
export default function UserSettingsForms({
  userData,
}: {
  userData: UserData
}) {
  return (
    <>
      <ProfilePictureForm imageUrl={userData.image} />
      <UsernameForm username={userData.username} />
      <EmailForm email={userData.email} />

      {/* Only render for admin users */}
      {isAdmin(userData.role) && (
        <Button asChild>
          <Link href="/admin">Enter Admin Mode</Link>
        </Button>
      )}
      <AdvancedSettingsForm />
    </>
  )
}
