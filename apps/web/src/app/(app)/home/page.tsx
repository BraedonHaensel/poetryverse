'use client'

import axios from 'axios'
import { Star } from 'lucide-react'
import { useEffect, useState } from 'react'

import MobilePageHeader from '@/components/mobile-page-header'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { PoemTagsSelector } from '@/components/poem-tags-selector'
import { api, displayApiError } from '@/lib/api'
import {
  type PoemData,
  type PoemTag,
  type PoemType,
  filterPoems,
  getFeedPoems,
  getPoemTags,
  getPoemTypes,
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
    type: { id: 'type-haiku', name: 'Haiku' },
    body: 'Cars go slow and fast.\nCars drive on highways all day.\nI really like cars.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.26,
    createdAt: new Date('2026-03-15T03:09:16.151Z'),
    updatedAt: new Date('2026-03-15T03:09:16.151Z'),
  },
  {
    id: 'cmnauvd5y0007356uo71h9zsh',
    title: 'The Pink Octopus',
    authorId: 'cmn5hpdln000104kzfbg941tb',
    type: { id: 'type-tercet', name: 'Tercet' },
    body: 'The octopus is pink and sweet.\nShe has many fishes to eat.\nCrabs are her favourite treat.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.75,
    createdAt: new Date('2026-03-17T05:11:13.151Z'),
    updatedAt: new Date('2026-03-17T05:11:13.151Z'),
  },
  {
    id: 'cmn5hpdln000204kzfbg941te',
    title: 'Running On Grass',
    authorId: 'cmn5hpdln000104kzfbg941ta',
    type: { id: 'type-haiku', name: 'Haiku' },
    body: "I like running fast.\nEspecially while on grass.\nUnless it's wet grass.",
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.16,
    createdAt: new Date('2026-03-19T05:12:13.151Z'),
    updatedAt: new Date('2026-03-19T05:12:13.151Z'),
  },
  {
    id: 'cmnauycv2000d356u2oq6xzt9',
    title: 'The Shadowed Wit',
    authorId: 'cmn5hpdln000104kzfbg941ta',
    type: { id: 'type-ballad', name: 'Ballad' },
    body: 'In the hall of mirrors, truth bends like light,\nwhere shadows dance and steal away the sight.\nThey whisper secrets only darkness knows,\nwhile reason falls wherever wisdom goes.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: true,
    aiLikelihoonScore: 0.85,
    createdAt: new Date('2026-03-20T05:12:13.151Z'),
    updatedAt: new Date('2026-03-20T05:12:13.151Z'),
  },
  {
    id: 'cmn5hq2m4000604kzj8mn2b5p',
    title: 'Winter Snow',
    authorId: 'cmn5hpdln000104kzfbg941tc',
    type: { id: 'type-haiku', name: 'Haiku' },
    body: 'Snowflakes fall gently.\nBlanketing the frozen ground.\nNature sleeps in white.',
    poemTags: [],
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoonScore: 0.22,
    createdAt: new Date('2026-03-10T14:20:45.151Z'),
    updatedAt: new Date('2026-03-10T14:20:45.151Z'),
  },
]

export type { PoemTag }

export default function HomePage() {
  const [poemTypeFilter, setPoemTypeFilter] = useState<PoemTypeFilterMode>('ALL')
  const [isFollowingOnly, setIsFollowingOnly] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [likedPoems, setLikedPoems] = useState<Set<string>>(new Set())
  const [fullPoemOpen, setFullPoemOpen] = useState(false)
  const [selectedPoem, setSelectedPoem] = useState<PoemData | null>(null)

  const [poems, setPoems] = useState<PoemData[]>(DUMMY_POEMS)
  const [allTags, setAllTags] = useState<PoemTag[]>([])
  const [poemTypes, setPoemTypes] = useState<PoemType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        if (USE_DUMMY_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setPoems(DUMMY_POEMS)
        } else {
          const [fetchedPoems, fetchedTags, fetchedTypes] = await Promise.all([
            getFeedPoems(),
            getPoemTags(),
            getPoemTypes(),
          ])
          setPoems(fetchedPoems)
          setAllTags(fetchedTags)
          setPoemTypes(fetchedTypes)
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          displayApiError(error, 'Failed to load home feed')
        }
        setPoems(DUMMY_POEMS)
      } finally {
        setIsLoading(false)
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
        <MobilePageHeader title="PoetryVerse" showLogo={true} />

        {/* Filters */}
        <div className="flex flex-col gap-3 px-2">
          <PoemTypeFilters
            mode={poemTypeFilter}
            setMode={setPoemTypeFilter}
            buttonClassName="flex-1"
          />

          <FollowingOnlyToggle
            isFollowingOnly={isFollowingOnly}
            setIsFollowingOnly={setIsFollowingOnly}
          />

          <div>
            <p className="mb-2 font-semibold">Tags</p>
            <PoemTagsSelector
              poemTags={allTags}
              selectedTagIds={selectedTags}
              onChange={setSelectedTags}
              isInvalid={false}
            />
          </div>
        </div>

        <Separator className="bg-black/30" />

        {/* Poems */}
        <div className="flex flex-col gap-2 px-2 pb-2">
          {filteredPoems.map((poem) => (
            <ShadowCard key={poem.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold">{poem.title}</h3>
                    <p className="text-sm text-gray-600">
                      {poem.authorId} · {poem.type.name}
                    </p>
                  </div>
                  {poem.isAIAssisted && (
                    <span className="whitespace-nowrap rounded-full bg-black px-3 py-1 text-sm font-bold text-white">
                      AI Assisted
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p className="text-sm">{poem.body.substring(0, 100)}...</p>
                <button
                  onClick={() => openFullPoem(poem)}
                  className="text-sm text-gray-400 hover:text-gray-500 transition-colors cursor-pointer"
                >
                  ... Read more
                </button>
                <div className="flex items-center gap-2 border-t pt-2">
                  <button
                    onClick={() => toggleLike(poem.id)}
                    className="flex items-center gap-2 border border-black p-1 pr-2 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Star
                      size={20}
                      className="text-black"
                      fill={likedPoems.has(poem.id) ? '#fbbf24' : 'none'}
                    />
                    <span className="text-sm font-semibold">0</span>
                  </button>
                </div>
              </CardContent>
            </ShadowCard>
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

            <div>
              <h3 className="mb-2 font-semibold">Feed</h3>
              <FollowingOnlyToggle
                isFollowingOnly={isFollowingOnly}
                setIsFollowingOnly={setIsFollowingOnly}
              />
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Tags</h3>
              <PoemTagsSelector
                poemTags={allTags}
                selectedTagIds={selectedTags}
                onChange={setSelectedTags}
                isInvalid={false}
              />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredPoems.map((poem) => (
              <ShadowCard key={poem.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <h3 className="font-bold">{poem.title}</h3>
                      <p className="text-xs text-gray-600">
                        {poem.authorId} · {poem.type.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  {poem.isAIAssisted && (
                    <span className="inline-block w-fit rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
                      AI Assisted
                    </span>
                  )}
                  <p className="text-sm">{poem.body.substring(0, 120)}...</p>
                  <button
                    onClick={() => openFullPoem(poem)}
                    className="text-sm text-gray-400 hover:text-gray-500 transition-colors cursor-pointer w-fit"
                  >
                    ... Read more
                  </button>
                  <div className="flex items-center gap-2 border-t pt-2">
                    <button
                      onClick={() => toggleLike(poem.id)}
                      className="flex items-center gap-2 border border-black p-1 pr-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Star
                        size={20}
                        className="text-black"
                        fill={likedPoems.has(poem.id) ? '#fbbf24' : 'none'}
                      />
                      <span className="text-sm font-semibold">0</span>
                    </button>
                  </div>
                </CardContent>
              </ShadowCard>
            ))}
          </div>
        </div>
      </div>

      {/* Full poem modal */}
      <Dialog open={fullPoemOpen} onOpenChange={setFullPoemOpen}>
        <DialogContent className="!max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedPoem?.title}</DialogTitle>
          </DialogHeader>
          {selectedPoem && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground mb-4">
                {selectedPoem.authorId} · {selectedPoem.type.name}
              </p>
              <div className="space-y-1 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <p className="leading-relaxed text-foreground md:text-lg">
                  {selectedPoem.body}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => toggleLike(selectedPoem.id)}
                  className="flex items-center gap-2 border border-black p-1 pr-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Star
                    size={28}
                    className="text-black"
                    fill={likedPoems.has(selectedPoem.id) ? '#fbbf24' : 'none'}
                  />
                  <span className="text-lg font-semibold">0</span>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
 