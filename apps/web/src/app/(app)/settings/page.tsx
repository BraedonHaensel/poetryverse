'use client'

import SignOutButton from '@/components/auth-buttons/sign-out-button'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { AdvancedSettingsForm } from './forms/advanced-settings-form'
import { EmailForm } from './forms/email-form'
import { ProfilePictureForm } from './forms/profile-picture-form'
import { UsernameForm } from './forms/username-form'

// TODO get user data from backend
const IMAGE_URL = '/sample-profile-image.jpg'
const USERNAME = 'sampleUsername123'
const EMAIL = 'myemail@email.com'

/**
 * User settings page.
 */
export default function UserSettings() {
  return (
    <div className="flex h-full min-h-fit p-10">
      <ShadowCard className="m-auto h-190 w-full max-w-170 sm:h-auto">
        {/* TODO when mobile layout is suppored, remove card and use h-full */}
        <CardHeader>
          <CardTitle className="mx-auto text-2xl font-bold">
            User Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-full flex-col gap-5">
          <ProfilePictureForm imageUrl={IMAGE_URL} />
          <UsernameForm username={USERNAME} />
          <EmailForm email={EMAIL} />
          <AdvancedSettingsForm />
          {/* Mobile-only sign out button */}
          <SignOutButton className="mt-auto sm:hidden" />
        </CardContent>
      </ShadowCard>
    </div>
  )
}
