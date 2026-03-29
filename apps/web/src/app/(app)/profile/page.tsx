'use client'

import { BookOpen, Users } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { Button } from '@/components/ui/button'
import { getUserData, UserData } from '@/lib/user-requests'

/**
 * Profile page.
 */
export default function Profile() {
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
      <div className="flex flex-1 flex-col md:hidden">
        <MobilePageHeader title={`@${userData.username}`} />
        <div className="flex flex-1 flex-col gap-2 p-4">Hello, world!</div>
      </div>

      {/* Desktop layout */}
      <div className="hidden min-h-0 w-full flex-1 md:flex">
        {/* Left sidebar */}
        <div className="w-90 overflow-y-auto">
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
            <div className="flex items-center divide-x-2 divide-gray-400 border-y border-black/30 bg-gray-200 py-4">
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
            <nav className="flex flex-col gap-4 p-2">
              <Button className="cursor-pointer justify-start text-lg font-semibold">
                <BookOpen />
                My Poems
              </Button>
              <Button
                className="cursor-pointer justify-start text-lg font-semibold"
                variant="ghost"
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
        <div className="flex h-full flex-1 overflow-y-auto bg-blue-300">
          right
          <div className="m-20 h-300 bg-amber-200">tall</div>
        </div>
      </div>
    </>
  )
}
