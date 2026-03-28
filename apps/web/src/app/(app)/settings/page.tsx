'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import SignOutButton from '@/components/auth-buttons/sign-out-button'
import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserData, UserData } from '@/lib/user-requests'
import { cn } from '@/lib/utils'

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
              <UserSettingsForms userData={userData} />
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
                <UserSettingsForms userData={userData} />
              </CardContent>
            </>
          )}
        </ShadowCard>
      </div>
    </>
  )
}
