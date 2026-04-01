'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import SignOutButton from '@/components/auth-buttons/sign-out-button'
import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api, displayApiError } from '@/lib/api'
import { getUserData, UserData } from '@/lib/user-requests'

import UserSettingsForms from './forms/user-settings-forms'

/**
 * User settings page.
 */
export default function UserSettings() {
  const [userData, setUserData] = useState<UserData>()
  const session = useSession()
  const isGuest = session.status === 'unauthenticated'

  // Get the user's data
  const didFetch = useRef(false)
  useEffect(() => {
    if (didFetch.current) return // Prevent double fetch in strict mode
    didFetch.current = true

    getUserData().then(setUserData)
  }, [])

  // Display a loading indicator until the user data has loaded
  if (userData === undefined) return <PageLoadingIndicator />

  /** Submit a username change. */
  async function onUsernameSubmit(username: string) {
    await api
      .patch('/api/users/me', { username })
      .then(async () => {
        console.log('Username updated to', username)
        await getUserData().then(setUserData)
        toast.success('Username updated')
      })
      .catch((error) => displayApiError(error, 'Failed to update username'))
  }

  /** Submit a profile picture change. */
  async function onProfilePictureSubmit(imageFile: File) {
    // Use a FormData to handle uploading the profile picture image file
    const formData = new FormData()
    formData.append('image', imageFile)

    await api
      .patch('/api/users/me/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(async () => {
        console.log('Profile picture updated')
        await getUserData().then(setUserData)
        toast.success('Profile picture updated')
      })
      .catch((error) =>
        displayApiError(error, 'Failed to update profile picture')
      )
  }

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col md:hidden">
        <MobilePageHeader title="User Settings" showSignInButton={isGuest} />
        <div className="flex flex-1 flex-col gap-2 p-4">
          {isGuest ? (
            <ShadowCard className="p-2 md:m-auto">
              <CardContent className="text-center">
                There are no settings available for guest users.
              </CardContent>
            </ShadowCard>
          ) : (
            <>
              <UserSettingsForms
                userData={userData}
                onProfilePictureSubmit={onProfilePictureSubmit}
                onUsernameSubmit={onUsernameSubmit}
              />
              {/* Mobile-only sign out button */}
              <SignOutButton className="mt-auto" />
            </>
          )}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="m-auto hidden w-full p-10 md:block">
        <ShadowCard className="m-auto max-w-170">
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
                <UserSettingsForms
                  userData={userData}
                  onProfilePictureSubmit={onProfilePictureSubmit}
                  onUsernameSubmit={onUsernameSubmit}
                />
              </CardContent>
            </>
          )}
        </ShadowCard>
      </div>
    </>
  )
}
