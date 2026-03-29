import { Fragment } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CONNECTIONS_FILTER_MODES = ['FOLLOWERS', 'FOLLOWING'] as const
export type ConnectionsFilterMode = (typeof CONNECTIONS_FILTER_MODES)[number]

type Props = {
  className?: string
  mode: ConnectionsFilterMode
  setMode: (mode: ConnectionsFilterMode) => void
}

/**
 * Followers and following connections filters.
 */
export default function ConnectionsFilters({
  className = '',
  mode,
  setMode,
}: Props) {
  return (
    <div
      className={cn('flex justify-center md:justify-start md:gap-4', className)}
    >
      {CONNECTIONS_FILTER_MODES.map((modeOption, i) => {
        const isOnMode = mode === modeOption

        return (
          <Fragment key={modeOption}>
            {/* Mobile controls */}
            <Button
              className={cn(
                'rounded-0 max-w-60 flex-1 cursor-pointer border-2 border-black/50 text-lg md:hidden',
                i !== 0 && 'rounded-l-none',
                i !== CONNECTIONS_FILTER_MODES.length - 1 && 'rounded-r-none'
              )}
              variant={modeOption === mode ? 'default' : 'outline'}
              onClick={() => setMode(modeOption)}
            >
              {modeOption.charAt(0) + modeOption.slice(1).toLowerCase()}
            </Button>

            {/* Desktop controls */}
            <button
              className={cn(
                'relative hidden cursor-pointer pb-1 text-3xl font-medium text-black md:block',
                isOnMode ? 'font-bold' : 'opacity-90'
              )}
              type="button"
              onClick={() => setMode(modeOption)}
            >
              {modeOption.charAt(0) + modeOption.slice(1).toLowerCase()}
              {/* Underline the navbar item for the current page */}
              {isOnMode && (
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded bg-black/40" />
              )}
            </button>
          </Fragment>
        )
      })}
    </div>
  )
}
