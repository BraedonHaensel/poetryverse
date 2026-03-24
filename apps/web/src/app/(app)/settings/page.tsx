import Link from 'next/link'

import SignOutButton from '@/components/auth-buttons/sign-out-button'
import MobilePageHeader from '@/components/mobile-page-header'
import { ShadowCard } from '@/components/shadow-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthSession } from '@/lib/nextauth'
import { cn } from '@/lib/utils'

import { AdvancedSettingsForm } from './forms/advanced-settings-form'
import { EmailForm } from './forms/email-form'
import { ProfilePictureForm } from './forms/profile-picture-form'
import { UsernameForm } from './forms/username-form'

// TODO get user data from backend
const IMAGE_URL = '/sample-profile-image.jpg'
const USERNAME = 'sampleUsername123'
const EMAIL = 'myemail@email.com'

/**
 * User settings forms used by both mobile and desktop.
 */
function UserSettingsForms() {
  return (
    <>
      <ProfilePictureForm imageUrl={IMAGE_URL} />
      <UsernameForm username={USERNAME} />
      <EmailForm email={EMAIL} />
      {/* TODO only render when signed in as an admin user */}
      <Button asChild>
        <Link href="/admin">Enter Admin Mode</Link>
      </Button>
      <AdvancedSettingsForm />
    </>
  )
}

/**
 * User settings page.
 */
export default async function UserSettings() {
  const session = await getAuthSession()
  const isGuest = !session

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col md:hidden">
        <MobilePageHeader title="User Settings" />
        <div className="flex flex-1 flex-col gap-2 p-4">
          {isGuest ? (
            <ShadowCard className="p-2 md:m-auto">
              <CardContent className="text-center">
                There are no settings available for guest users.
              </CardContent>
            </ShadowCard>
          ) : (
            <>
              <UserSettingsForms />
              {/* Mobile-only sign out button */}
              <SignOutButton className="mt-auto" />
            </>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="m-auto hidden w-full p-10 md:block">
        <ShadowCard className={cn('m-auto max-w-170')}>
          {isGuest ? (
            <CardContent className="text-center">
              There are no settings available for guest users.
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="mx-auto text-2xl font-bold">
                  User Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-5">
                <UserSettingsForms />
              </CardContent>
            </>
          )}
        </ShadowCard>
      </div>
    </>
  )
}
