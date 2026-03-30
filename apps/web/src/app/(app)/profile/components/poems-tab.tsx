import PoemFilters, { PoemFilterMode } from '@/components/poem-filters'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { ProfileStat } from '../page-contents'

type Props = {
  isMyPage: boolean
  profileStats: ProfileStat[]
  filterMode: PoemFilterMode
  setFilterMode: (filterMode: PoemFilterMode) => void
}

/**
 * Poems tab contents.
 * @param isMyPage Whether the user is viewing their own page.
 * @param profileStats Poem, followers, and following users stats.
 * @param filterMode The current poem filter mode.
 * @param setFilterMode Callback to set the poem filter mode.
 */
export default function PoemsTab({
  isMyPage,
  profileStats,
  filterMode,
  setFilterMode,
}: Props) {
  return (
    <>
      {/* Profile stats (mobile only, in the sidebar on desktop) */}
      <div className="flex items-center divide-x-2 divide-gray-300 border-b border-black/30 pb-2 md:hidden">
        {profileStats.map((item, i) => (
          <div
            key={item.title}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 px-2',
              i !== 0 && 'cursor-pointer hover:opacity-70' // Can't click Poems on mobile
            )}
            onClick={item.onClick}
          >
            <span className="font-medium">{item.title}</span>
            <span className="font-bold">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Poem filter controls */}
      <PoemFilters
        className="p-2 pt-0 md:p-0 md:pb-4"
        filterMode={filterMode}
        modeOptions={
          [
            'ALL',
            ...(isMyPage
              ? ['PUBLIC', 'PRIVATE']
              : ['AI_ASSISTED', 'HANDWRITTEN']),
          ] as PoemFilterMode[]
        }
        setFilterMode={setFilterMode}
      />

      {/* Mobile poems list */}
      <div className="flex flex-col gap-2 p-2 md:hidden">
        {/* TODO Replace with real poems */}
        {Array.from({ length: 10 }).map((_, i) => (
          <ShadowCard key={i}>
            <CardHeader>Placeholder Title {i}</CardHeader>
            <CardContent>Placeholder Content {i}</CardContent>
          </ShadowCard>
        ))}
      </div>

      {/* Desktop poems list */}
      <div className="hidden gap-4 md:grid xl:grid-cols-2">
        {/* TODO Replace with real poems */}
        {Array.from({ length: 10 }).map((_, i) => (
          <ShadowCard key={i}>
            <CardHeader>Placeholder Title {i}</CardHeader>
            <CardContent>Placeholder Content {i}</CardContent>
          </ShadowCard>
        ))}
      </div>
    </>
  )
}
