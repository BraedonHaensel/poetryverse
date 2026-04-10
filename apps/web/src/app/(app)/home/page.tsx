'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import OtherUserPoemMenu from '@/components/other-user-poem-menu'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import PoemCard from '@/components/poem-card'
import PoemFilters, { PoemFilterMode } from '@/components/poem-filters'
import { PoemTagsFilter } from '@/components/poem-tags-filter'
import { PoemTagsSelector } from '@/components/poem-tags-selector'
import SignInRequiredDialog from '@/components/sign-in-required-dialog'
import { Separator } from '@/components/ui/separator'
import { displayApiError } from '@/lib/api'
import {
  filterPoems,
  getFeedPoems,
  getPoemTags,
  likePoem,
  type PoemData,
  type PoemTag,
  unlikePoem,
} from '@/lib/poem-requests'
import { getUserFollowing } from '@/lib/user-requests'

import { FollowingOnlyToggle } from './following-only-toggle'

export type { PoemTag }

export default function HomePage() {
  const [poemTypeFilter, setPoemTypeFilter] = useState<PoemFilterMode>('ALL')
  const [isFollowingOnly, setIsFollowingOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showSignInDialog, setShowSignInDialog] = useState(false)

  const [poems, setPoems] = useState<PoemData[]>()
  const [filteredPoems, setFilteredPoems] = useState<PoemData[]>([])
  const [allTags, setAllTags] = useState<PoemTag[]>([])

  const [followingUserIds, setFollowingUserIds] = useState<string[]>()

  const session = useSession()
  const isGuest = session.status === 'unauthenticated'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPoems, fetchedTags] = await Promise.all([
          getFeedPoems(),
          getPoemTags(),
        ])
        setPoems(fetchedPoems)
        setAllTags(fetchedTags)

        if (!isGuest) {
          const followingUsers = await getUserFollowing()
          setFollowingUserIds(
            followingUsers === undefined
              ? []
              : followingUsers.map((user) => user.id)
          )
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          displayApiError(error, 'Failed to load home feed')
        }
      }
    }

    fetchData()
  }, [isGuest])

  // Update the filtered poems to display
  useEffect(() => {
    // Filter by AI Assisted vs Handwritten
    let filteredPoems =
      poems === undefined ? [] : filterPoems(poems, poemTypeFilter)

    // Filter by poem tags
    if (selectedTags.length > 0) {
      filteredPoems = filteredPoems.filter((poem) =>
        poem.poemTags.some((tag) => selectedTags.includes(tag.tag.id))
      )
    }

    // Filter by following users
    if (isFollowingOnly && followingUserIds !== undefined) {
      filteredPoems = filteredPoems.filter((poem) =>
        followingUserIds.some((id) => poem.authorId === id)
      )
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilteredPoems(filteredPoems)
    console.log(selectedTags)
  }, [poems, poemTypeFilter, selectedTags, isFollowingOnly, followingUserIds])

  if (poems === undefined) return <PageLoadingIndicator />

  /** Handles liking or removing a like from a poem. */
  const handleToggleLike = (poemId: string, isLike: boolean) => {
    if (isGuest) {
      setShowSignInDialog(true)
      return
    }

    // Send the like or unlike request to the API
    if (isLike) {
      likePoem(poemId)
    } else {
      unlikePoem(poemId)
    }

    // Update the poem data for the like or unlike
    setPoems((prev) => {
      if (prev === undefined) return undefined
      return prev.map((poem) =>
        poem.id === poemId
          ? {
              ...poem,
              isLikedByCurrentUser: isLike,
              _count: {
                likes: isLike ? poem._count.likes + 1 : poem._count.likes - 1,
              },
            }
          : poem
      )
    })
  }

  return (
    <>
      <SignInRequiredDialog
        isOpen={showSignInDialog}
        onClose={() => setShowSignInDialog(false)}
      />

      {/* Mobile layout */}
      <div className="flex flex-1 flex-col gap-4 md:hidden">
        <MobilePageHeader
          title="PoetryVerse"
          showLogo={true}
          showSignInButton={isGuest}
        />

        {/* Filters */}
        <div className="flex flex-col gap-3 px-2">
          <PoemFilters
            filterMode={poemTypeFilter}
            modeOptions={
              ['ALL', 'AI_ASSISTED', 'HANDWRITTEN'] as PoemFilterMode[]
            }
            setFilterMode={setPoemTypeFilter}
          />

          {!isGuest && (
            <FollowingOnlyToggle
              isFollowingOnly={isFollowingOnly}
              setIsFollowingOnly={setIsFollowingOnly}
            />
          )}

          <PoemTagsFilter
            poemTags={allTags}
            selectedTagIds={selectedTags}
            onChange={setSelectedTags}
          />
        </div>

        <Separator className="bg-black/30" />

        {/* Poems */}
        <div className="flex flex-col gap-2 px-2 pb-2">
          {filteredPoems.map((poem) => (
            <PoemCard key={poem.id} poem={poem} onToggleLike={handleToggleLike}>
              {/* Poem dropdown menu - only on mobile */}
              {!isGuest && <OtherUserPoemMenu poem={poem} />}
            </PoemCard>
          ))}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden min-h-0 w-full flex-1 gap-4 md:flex">
        {/* Left sidebar */}
        <div className="w-75 overflow-y-auto border-r-2 border-black/30 px-4 py-4 lg:w-90">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Home</h2>

            <div>
              <h3 className="mb-2 font-semibold">Poem Source</h3>
              <PoemFilters
                className="flex-col md:gap-2"
                buttonClassName="justify-start py-1"
                filterMode={poemTypeFilter}
                modeOptions={
                  ['ALL', 'AI_ASSISTED', 'HANDWRITTEN'] as PoemFilterMode[]
                }
                setFilterMode={setPoemTypeFilter}
              />
            </div>

            {!isGuest && (
              <div>
                <h3 className="mb-2 font-semibold">Feed</h3>
                <FollowingOnlyToggle
                  isFollowingOnly={isFollowingOnly}
                  setIsFollowingOnly={setIsFollowingOnly}
                />
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold">Tags</h3>
              <PoemTagsSelector
                className="border-black/50 bg-white"
                poemTags={allTags}
                selectedTagIds={selectedTags}
                onChange={setSelectedTags}
                isInvalid={false}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid grid-cols-1 gap-4 min-[1200px]:grid-cols-2 min-[1600px]:grid-cols-3">
            {filteredPoems.map((poem) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onToggleLike={handleToggleLike}
              >
                {/* Poem dropdown menu */}
                {!isGuest && <OtherUserPoemMenu poem={poem} />}
              </PoemCard>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
