'use client'

import { BookOpen, Users } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { Button } from '@/components/ui/button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { getUserData, UserData } from '@/lib/user-requests'

import PoemVisibilityFilters, {
  PoemVisibilityFilterMode,
} from './poem-visibility-filters'

type DesktopBaseTab = 'MY_POEMS' | 'CONNECTIONS'

/**
 * Profile page.
 */
export default function Profile() {
  const [desktopBaseTab, setDesktopBaseTab] =
    useState<DesktopBaseTab>('MY_POEMS')
  const [poemVisibilityFilterMode, setPoemVisibilityFilterMode] =
    useState<PoemVisibilityFilterMode>('ALL')

  const [userData, setUserData] = useState<UserData>()

  // Get the user's data
  const didFetch = useRef(false)
  useEffect(() => {
    if (didFetch.current) return // Prevent double fetch in strict mode
    didFetch.current = true

    getUserData().then(setUserData)
  }, [])

  // Display a loading indicator until the user data has loaded
  if (userData === undefined) return <PageLoadingIndicator />

  const profileStats = [
    { title: 'Poems', count: 4 },
    { title: 'Followers', count: 5 },
    { title: 'Following', count: 6 },
  ]

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col gap-2 divide-y-2 divide-gray-300 md:hidden">
        <MobilePageHeader title={`@${userData.username}`} />

        {/* Profile stats */}
        <div className="flex items-center divide-x-2 divide-gray-300 border-b border-black/30 pb-2">
          {profileStats.map((item) => (
            <div
              key={item.title}
              className="flex flex-1 items-center justify-center gap-2 px-2"
            >
              <span className="font-medium">{item.title}</span>
              <span className="font-bold">{item.count}</span>
            </div>
          ))}
        </div>

        <PoemVisibilityFilters
          className="p-2 pt-0"
          mode={poemVisibilityFilterMode}
          setMode={setPoemVisibilityFilterMode}
        />

        <div className="flex flex-col gap-2 p-2">
          {/* TODO Replace with real poems */}
          {Array.from({ length: 10 }).map((_, i) => (
            <ShadowCard key={i}>
              <CardHeader>Placeholder Title {i}</CardHeader>
              <CardContent>Placeholder Content {i}</CardContent>
            </ShadowCard>
          ))}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden min-h-0 w-full flex-1 md:flex">
        {/* Left sidebar */}
        <div className="w-75 overflow-y-auto border-r-2 border-black/30 lg:w-90">
          <div className="flex min-h-full flex-col">
            {/* Username */}
            <div className="flex h-16 items-center gap-2 bg-white px-2 text-2xl font-extrabold">
              <Image
                className="rounded-full border-2"
                src={userData.image}
                loading="eager"
                alt="Profile picture"
                width={36}
                height={36}
              />
              <h1 className="truncate">{`@${userData.username}`}</h1>
            </div>

            {/* Profile stats */}
            <div className="flex items-center divide-x-2 divide-black/30 border-y border-black/30 bg-gray-200/65 py-4">
              {profileStats.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-1 flex-col items-center px-2"
                >
                  <span className="font-bold">{item.count}</span>
                  <span className="font-medium">{item.title}</span>
                </div>
              ))}
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-4 px-2 py-4">
              <Button
                className="cursor-pointer justify-start text-lg font-semibold"
                variant={desktopBaseTab === 'MY_POEMS' ? 'default' : 'ghost'}
                onClick={() => setDesktopBaseTab('MY_POEMS')}
              >
                <BookOpen />
                My Poems
              </Button>
              <Button
                className="cursor-pointer justify-start text-lg font-semibold"
                variant={desktopBaseTab === 'CONNECTIONS' ? 'default' : 'ghost'}
                onClick={() => setDesktopBaseTab('CONNECTIONS')}
              >
                <Users />
                Connections
              </Button>
            </nav>

            <div className="mx-2 h-0.5 bg-gray-300" />

            <div className="relative mt-auto h-60 w-full">
              <Image
                className="object-contain"
                src="/poem-writing-hand.svg"
                alt="Hand writing poem"
                loading="eager"
                fill
              />
            </div>
          </div>
        </div>

        {/* Main page contents */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col px-4 py-4 xl:px-10">
            {desktopBaseTab === 'MY_POEMS' ? (
              <div className="flex flex-col gap-4 divide-y-2 divide-gray-300">
                <PoemVisibilityFilters
                  className="gap-4 pb-4"
                  buttonClassName="w-40"
                  mode={poemVisibilityFilterMode}
                  setMode={setPoemVisibilityFilterMode}
                />

                <div className="grid grid-cols-2 gap-4">
                  {/* TODO Replace with real poems */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <ShadowCard key={i}>
                      <CardHeader>Placeholder Title {i}</CardHeader>
                      <CardContent>Placeholder Content {i}</CardContent>
                    </ShadowCard>
                  ))}
                </div>
              </div>
            ) : (
              <>Connections</>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
