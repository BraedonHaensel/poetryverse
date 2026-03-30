import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const POEM_VISIBILITY_FILTER_MODES = ['ALL', 'PUBLIC', 'PRIVATE'] as const
export type PoemVisibilityFilterMode =
  (typeof POEM_VISIBILITY_FILTER_MODES)[number]

type Props = {
  className?: string
  buttonClassName?: string
  mode: PoemVisibilityFilterMode
  setMode: (mode: PoemVisibilityFilterMode) => void
}

/**
 * Poem visibility filters.
 */
export default function PoemVisibilityFilters({
  className = '',
  buttonClassName = 'flex-1',
  mode,
  setMode,
}: Props) {
  return (
    <div className={cn('flex gap-2', className)}>
      {POEM_VISIBILITY_FILTER_MODES.map((modeOption) => (
        <Button
          key={modeOption}
          className={cn(
            'cursor-pointer border-2 border-black/50 text-lg font-bold',
            buttonClassName
          )}
          variant={modeOption === mode ? 'default' : 'outline'}
          onClick={() => setMode(modeOption)}
        >
          {modeOption.charAt(0) + modeOption.slice(1).toLowerCase()}
        </Button>
      ))}
    </div>
  )
}
