'use client'

import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import { FullPoemDialog } from '@/components/full-poem-dialog'
import { PoemCard } from '@/components/poem-card'
import { PoemTagsFilter } from '@/components/poem-tags-filter'
import { PoemTagsSelector } from '@/components/poem-tags-selector'
import { Separator } from '@/components/ui/separator'
import { displayApiError } from '@/lib/api'
import {
  filterPoems,
  getFeedPoems,
  getPoemTags,
  type PoemData,
  type PoemTag,
} from '@/lib/poem-requests'

import { FollowingOnlyToggle } from './following-only-toggle'
import PoemTypeFilters, { PoemTypeFilterMode } from './poem-type-filters'

const USE_DUMMY_DATA = true

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
    count: { likes: 5 },
    createdAt: new Date('2026-03-15T03:09:16.151Z'),
    updatedAt: new Date('2026-03-15T03:09:16.151Z'),
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
    count: { likes: 8 },
    createdAt: new Date('2026-03-17T05:11:13.151Z'),
    updatedAt: new Date('2026-03-17T05:11:13.151Z'),
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
    count: { likes: 3 },
    createdAt: new Date('2026-03-19T05:12:13.151Z'),
    updatedAt: new Date('2026-03-19T05:12:13.151Z'),
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
    count: { likes: 12 },
    createdAt: new Date('2026-03-20T05:12:13.151Z'),
    updatedAt: new Date('2026-03-20T05:12:13.151Z'),
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
    count: { likes: 6 },
    createdAt: new Date('2026-03-10T14:20:45.151Z'),
    updatedAt: new Date('2026-03-10T14:20:45.151Z'),
  },
]

export type { PoemTag }

export default function HomePage() {
  const { data: session } = useSession()
  const isGuest = !session
  const [poemTypeFilter, setPoemTypeFilter] =
    useState<PoemTypeFilterMode>('ALL')
  const [isFollowingOnly, setIsFollowingOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [likedPoems, setLikedPoems] = useState<Set<string>>(new Set())
  const [fullPoemOpen, setFullPoemOpen] = useState(false)
  const [selectedPoem, setSelectedPoem] = useState<PoemData | null>(null)

  const [poems, setPoems] = useState<PoemData[]>(DUMMY_POEMS)
  const [allTags, setAllTags] = useState<PoemTag[]>([])

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
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          displayApiError(error, 'Failed to load home feed')
        }
        setPoems(DUMMY_POEMS)
      }
    }

    fetchData()
  }, [])

  const toggleLike = (poemId: string) => {
    const newLiked = new Set(likedPoems)
    if (newLiked.has(poemId)) {
      newLiked.delete(poemId)
    } else {
      newLiked.add(poemId)
    }
    setLikedPoems(newLiked)
  }

  const openFullPoem = (poem: PoemData) => {
    setSelectedPoem(poem)
    setFullPoemOpen(true)
  }

  const filteredPoems = filterPoems(poems, poemTypeFilter)

  return (
    <>
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col gap-4 md:hidden">
        <MobilePageHeader title="PoetryVerse" showLogo={true} showSignInButton={isGuest} />

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
            <PoemCard
              key={poem.id}
              poem={poem}
              isLiked={likedPoems.has(poem.id)}
              onToggleLike={() => toggleLike(poem.id)}
              onReadMore={() => openFullPoem(poem)}
              previewLength={100}
            />
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
          <div className="grid gap-4 grid-cols-1 min-[1200px]:grid-cols-2 min-[1600px]:grid-cols-3">
            {filteredPoems.map((poem) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                isLiked={likedPoems.has(poem.id)}
                onToggleLike={() => toggleLike(poem.id)}
                onReadMore={() => openFullPoem(poem)}
                previewLength={120}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Full poem modal */}
      <FullPoemDialog
        poem={selectedPoem}
        isOpen={fullPoemOpen}
        isLiked={selectedPoem ? likedPoems.has(selectedPoem.id) : false}
        onOpenChange={setFullPoemOpen}
        onToggleLike={() => selectedPoem && toggleLike(selectedPoem.id)}
      />
    </>
  )
}
