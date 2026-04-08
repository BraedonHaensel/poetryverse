'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import OtherUserPoemMenu from '@/components/other-user-poem-menu'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import PoemCard from '@/components/poem-card'
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
import PoemTypeFilters, { PoemTypeFilterMode } from './poem-type-filters'

const USE_DUMMY_DATA = false

// Dummy poem data for development/preview
const DUMMY_POEMS: PoemData[] = [
  {
    id: 'cmnauvhd1000b356uw16pnt8t',
    title: 'I Like Cars',
    authorId: 'cmn5hpdln000104kzfbg941tb',
    author: { username: 'User 2' },
    type: { id: 'type-haiku', name: 'Haiku' },
    body: 'Cars go slow and fast.\nCars drive on highways all day.\nI really like cars.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.26,
    _count: { likes: 5 },
    createdAt: new Date('2026-03-15T03:09:16.151Z'),
    updatedAt: new Date('2026-03-15T03:09:16.151Z'),
    approvalStatus: 'APPROVED',
    isLikedByCurrentUser: true,
  },
  {
    id: 'cmnauvd5y0007356uo71h9zsh',
    title: 'The Pink Octopus',
    authorId: 'cmn5hpdln000104kzfbg941tb',
    author: { username: 'User 2' },
    type: { id: 'type-tercet', name: 'Tercet' },
    body: 'The octopus is pink and sweet.\nShe has many fishes to eat.\nCrabs are her favourite treat.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.75,
    _count: { likes: 8 },
    createdAt: new Date('2026-03-17T05:11:13.151Z'),
    updatedAt: new Date('2026-03-17T05:11:13.151Z'),
    approvalStatus: 'APPROVED',
    isLikedByCurrentUser: false,
  },
  {
    id: 'cmn5hpdln000204kzfbg941te',
    title: 'Running On Grass',
    authorId: 'cmn5hpdln000104kzfbg941ta',
    author: { username: 'blakeN99' },
    type: { id: 'type-haiku', name: 'Haiku' },
    body: "I like running fast.\nEspecially while on grass.\nUnless it's wet grass.",
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.16,
    _count: { likes: 3 },
    createdAt: new Date('2026-03-19T05:12:13.151Z'),
    updatedAt: new Date('2026-03-19T05:12:13.151Z'),
    approvalStatus: 'APPROVED',
    isLikedByCurrentUser: true,
  },
  {
    id: 'cmnauycv2000d356u2oq6xzt9',
    title: 'The Shadowed Wit',
    authorId: 'cmn5hpdln000104kzfbg941ta',
    author: { username: 'blakeN99' },
    type: { id: 'type-ballad', name: 'Ballad' },
    body: 'In the hall of mirrors, truth bends like light,\nwhere shadows dance and steal away the sight.\nThey whisper secrets only darkness knows,\nwhile reason falls wherever wisdom goes.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: true,
    aiLikelihoonScore: 0.85,
    _count: { likes: 12 },
    createdAt: new Date('2026-03-20T05:12:13.151Z'),
    updatedAt: new Date('2026-03-20T05:12:13.151Z'),
    approvalStatus: 'APPROVED',
    isLikedByCurrentUser: true,
  },
  {
    id: 'cmn5hq2m4000604kzj8mn2b5p',
    title: 'Winter Snow',
    authorId: 'cmn5hpdln000104kzfbg941tc',
    author: { username: 'poetryLover' },
    type: { id: 'type-haiku', name: 'Haiku' },
    body: 'Snowflakes fall gently.\nBlanketing the frozen ground.\nNature sleeps in white.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.22,
    _count: { likes: 6 },
    createdAt: new Date('2026-03-10T14:20:45.151Z'),
    updatedAt: new Date('2026-03-10T14:20:45.151Z'),
    approvalStatus: 'APPROVED',
    isLikedByCurrentUser: true,
  },
]

export type { PoemTag }

export default function HomePage() {
  const [poemTypeFilter, setPoemTypeFilter] =
    useState<PoemTypeFilterMode>('ALL')
  const [isFollowingOnly, setIsFollowingOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showSignInDialog, setShowSignInDialog] = useState(false)

  const [poems, setPoems] = useState<PoemData[] | undefined>(DUMMY_POEMS)
  const [filteredPoems, setFilteredPoems] = useState<PoemData[]>([])
  const [allTags, setAllTags] = useState<PoemTag[]>([])

  const [followingUserIds, setFollowingUserIds] = useState<string[]>()

  const session = useSession()
  const isGuest = session.status === 'unauthenticated'

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_DUMMY_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setPoems(DUMMY_POEMS)
        } else {
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
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          displayApiError(error, 'Failed to load home feed')
        }
        setPoems(DUMMY_POEMS)
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
          <PoemTypeFilters
            mode={poemTypeFilter}
            setMode={setPoemTypeFilter}
            buttonClassName="flex-1"
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
              <h3 className="mb-2 font-semibold">Poem Type</h3>
              <PoemTypeFilters
                mode={poemTypeFilter}
                setMode={setPoemTypeFilter}
                className="flex-col"
                buttonClassName="w-full justify-start"
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
                className="bg-white"
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
