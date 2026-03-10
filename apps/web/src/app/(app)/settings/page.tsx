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
    <ShadowCard className="mx-auto w-full max-w-170">
      <CardHeader>
        <CardTitle className="mx-auto text-2xl font-bold">
          User Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ProfilePictureForm imageUrl={IMAGE_URL} />
        <UsernameForm username={USERNAME} />
        <EmailForm email={EMAIL} />
        <AdvancedSettingsForm />
      </CardContent>
    </ShadowCard>
  )
}
