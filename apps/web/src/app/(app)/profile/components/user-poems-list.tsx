import React from 'react'

import CreateDropdown from '@/components/create-nav-dropdown'
import CreateSheet from '@/components/create-nav-sheet'
import { LargeButton } from '@/components/large-button'
import MyPoemMenu from '@/components/my-poem-menu'
import OtherUserPoemMenu from '@/components/other-user-poem-menu'
import PoemCard from '@/components/poem-card'
import { PoemFilterMode } from '@/components/poem-filters'
import { PoemData } from '@/lib/poem-requests'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  isMyPage: boolean
  isGuest: boolean
  filterMode: PoemFilterMode
  filteredPoems: PoemData[]
  onSetPublic: (poemid: string) => void
  onSetPrivate: (poemId: string) => void
  onDeletePoem: (poemId: string) => void
}

/**
 * Displays a list of a user's poems.
 * @param className Optional additional className values to apply.
 * @param isMyPage Whether the user is viewing their own page.
 * @param isGuest Whether the current user is a guest.
 * @param filterMode The current poem filter mode.
 * @param filteredPoems The filtered list of poems to display.
 * @param onSetPublic Callback to set a poem's visibility to public.
 * @param onSetPrivate Callback to set a poem's visibility to private.
 * @param onDeletePoem Callback to delete a poem.
 */
export default function UserPoemsList({
  className,
  isMyPage,
  isGuest,
  filterMode,
  filteredPoems,
  onSetPublic,
  onSetPrivate,
  onDeletePoem,
}: Props) {
  if (filteredPoems.length === 0) {
    // No poems to display
    const containerStyle = 'm-auto px-2 pb-2 md:p-0 text-center'

    if (filterMode !== 'ALL') {
      // No poems for the current filters
      return <p className={containerStyle}>No poems match the filters.</p>
    }

    if (!isMyPage) {
      // Not your page, and the user has no poems with the "All" filter
      return (
        <p className={containerStyle}>
          This user does not have any public poems.
        </p>
      )
    }

    return (
      // Your page, and you have no poems
      <div className={cn(containerStyle, 'flex w-fit flex-col gap-4')}>
        <p>You haven&apos;t written any poems yet.</p>

        {/* Mobile create mode selection */}
        <CreateSheet className="md:hidden">
          <LargeButton>Create Your First Poem</LargeButton>
        </CreateSheet>

        {/* Desktop create mode selection */}
        <CreateDropdown className="hidden md:block">
          <LargeButton>Create Your First Poem</LargeButton>
        </CreateDropdown>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-2 md:gap-4 xl:grid-cols-2', className)}>
      {filteredPoems.map((poem) => (
        <PoemCard
          key={poem.id}
          poem={poem}
          // TODO: Check if user liked the poem
          isLiked={true}
          onToggleLike={() => console.log('like')}
          isOnProfilePage={true}
          isOnMyProfilePage={isMyPage}
        >
          {isMyPage ? (
            <MyPoemMenu
              poem={poem}
              onSetPublic={onSetPublic}
              onSetPrivate={onSetPrivate}
              onDeletePoem={onDeletePoem}
            />
          ) : (
            // Display the poem menu to registered users
            !isGuest && <OtherUserPoemMenu poem={poem} />
          )}
        </PoemCard>
      ))}
    </div>
  )
}
