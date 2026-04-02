import { BookOpen, UserMinus, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { UserData } from '@/lib/user-requests'
import { cn } from '@/lib/utils'

import { ProfilePageTab, ProfileStat } from '../page-contents'

type Props = {
  viewingUserId: string | undefined
  viewingUserData: UserData
  profileStats: ProfileStat[]
  isMyPage: boolean
  isGuest: boolean
  sendFollow: (userId: string | undefined) => void
  sendUnfollow: (userId: string | undefined) => void
  pageTab: ProfilePageTab
  setPageTab: (tab: ProfilePageTab) => void
}

/**
 * Profile page sidebar displayed for desktop views.
 * @param viewingUserId ID of the user's page being viewed.
 * @param viewingUserData User data of the user being viewed.
 * @param profileStats Poem, followers, and following users stats.
 * @param isMyPage Whether the user is viewing their own page.
 * @param isGuest Whether the current user is a guest.
 * @param sendFollow Callback to follow a user.
 * @param sendUnfollow Callback to unfollow a user.
 * @param pageTab Currently open profile page tab.
 * @param setPageTab Callback to set the profile page tab.
 */
export function ProfileSidebarDesktop({
  viewingUserId,
  viewingUserData: userData,
  profileStats,
  isMyPage,
  isGuest,
  sendFollow,
  sendUnfollow,
  pageTab,
  setPageTab,
}: Props) {
  return (
    <div className="w-80 overflow-y-auto border-r-2 border-black/30 lg:w-90">
      <div className="flex min-h-full flex-col">
        {/* Profile picture and username */}
        <div className="flex h-18 items-center gap-2 bg-white px-4 text-2xl font-extrabold">
          <div className="relative aspect-square h-11">
            <Image
              className="rounded-full border-2 border-black object-cover"
              src={userData.image}
              loading="eager"
              alt="Profile picture"
              sizes="44px"
              fill
            />
          </div>
          <h1 className="break-all">{`@${userData.username}`}</h1>{' '}
        </div>

        {/* Profile stats */}
        <div className="border-y border-black/30 bg-gray-200/65 py-4">
          <div className="flex items-center divide-x-2 divide-black/30 px-4">
            {profileStats.map((item) => (
              <div
                key={item.title}
                className="flex flex-1 flex-col items-center"
              >
                <span className="font-bold">{item.count}</span>
                <span className="font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Follow/Unfollow button when viewing another user while signed in */}
        {!isMyPage && !isGuest && (
          <>
            <Button
              className={cn(
                'mx-4 my-4 cursor-pointer justify-start',
                userData.isFollowingUser &&
                  'bg-off-white border border-black text-black hover:bg-gray-300'
              )}
              onClick={() =>
                userData.isFollowingUser
                  ? sendUnfollow(viewingUserId)
                  : sendFollow(viewingUserId)
              }
            >
              {userData.isFollowingUser ? <UserMinus /> : <UserPlus />}
              <span>{userData.isFollowingUser ? 'Unfollow' : 'Follow'}</span>
            </Button>

            {/* Divider line */}
            <div className="mx-4 h-0.5 bg-gray-300" />
          </>
        )}

        {/* Page tab selectors */}
        <nav className="flex flex-col gap-4 px-4 py-4">
          <Button
            className="cursor-pointer justify-start text-lg font-semibold"
            variant={pageTab === 'MY_POEMS' ? 'default' : 'ghost'}
            onClick={() => setPageTab('MY_POEMS')}
          >
            <BookOpen />
            {isMyPage ? 'My Poems' : 'Poems'}
          </Button>
          <Button
            className="cursor-pointer justify-start text-lg font-semibold"
            variant={pageTab === 'CONNECTIONS' ? 'default' : 'ghost'}
            onClick={() => setPageTab('CONNECTIONS')}
          >
            <Users />
            Connections
          </Button>
        </nav>

        {/* Divider line */}
        <div className="mx-4 h-0.5 bg-gray-300" />

        {/* Writing hand image */}
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
  )
}
