import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { isAdmin, UserData } from '@/lib/user-requests'

import { AdvancedSettingsForm } from './advanced-settings-form'
import { EmailForm } from './email-form'
import { ProfilePictureForm } from './profile-picture-form'
import { UsernameForm } from './username-form'

type Props = {
  userData: UserData
  onProfilePictureSubmit: (imageFile: File) => Promise<void>
  onUsernameSubmit: (username: string) => Promise<void>
  onDeleteAccount: () => Promise<void>
}

/**
 * Collection of all user settings forms used by both mobile and desktop.
 */
export default function UserSettingsForms({
  userData,
  onUsernameSubmit,
  onProfilePictureSubmit,
  onDeleteAccount,
}: Props) {
  return (
    <>
      <ProfilePictureForm
        imageUrl={userData.image}
        onProfilePictureSubmit={onProfilePictureSubmit}
      />
      <UsernameForm
        username={userData.username}
        onUsernameSubmit={onUsernameSubmit}
      />
      <EmailForm email={userData.email} />

      {/* Only render for admin users */}
      {isAdmin(userData.role) && (
        <Button asChild>
          <Link href="/admin">Enter Admin Mode</Link>
        </Button>
      )}
      <AdvancedSettingsForm onDeleteAccount={onDeleteAccount} />
    </>
  )
}
