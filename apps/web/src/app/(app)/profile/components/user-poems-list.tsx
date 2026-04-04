import CreateDropdown from '@/components/create-nav-dropdown'
import CreateSheet from '@/components/create-nav-sheet'
import { LargeButton } from '@/components/large-button'
import { PoemFilterMode } from '@/components/poem-filters'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader } from '@/components/ui/card'
import { PoemData } from '@/lib/poem-requests'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
  isMyPage: boolean
  filterMode: PoemFilterMode
  filteredPoems: PoemData[]
}

/**
 * Displays a list of a user's poems.
 * @param className Optional additional className values to apply.
 * @param isMyPage Whether the user is viewing their own page.
 * @param filterMode The current poem filter mode.
 * @param poems The filtered list of poems to display.
 */
export default function UserPoemsList({
  className,
  isMyPage,
  filterMode,
  filteredPoems,
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
      {/* TODO Display proper poem cards */}
      {/* TODO Display poem visibility and delete controls menu */}
      {filteredPoems.map((poem) => (
        <ShadowCard key={poem.id}>
          <CardHeader>{poem.title}</CardHeader>
          <CardContent className="whitespace-pre-wrap">{poem.body}</CardContent>
        </ShadowCard>
      ))}
    </div>
  )
}
