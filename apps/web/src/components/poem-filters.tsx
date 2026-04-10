import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type PoemFilterMode =
  | 'ALL'
  | 'PUBLIC'
  | 'PRIVATE'
  | 'AI_ASSISTED'
  | 'HANDWRITTEN'

// Display labels for each poem filter mode
const POEM_FILTER_MODE_LABELS: Record<PoemFilterMode, string> = {
  ALL: 'All',
  PUBLIC: 'Public',
  PRIVATE: 'Private',
  AI_ASSISTED: 'AI-Assisted',
  HANDWRITTEN: 'Handwritten',
}

type Props = {
  className?: string
  buttonClassName?: string
  filterMode: PoemFilterMode
  modeOptions: PoemFilterMode[]
  setFilterMode: (filterMode: PoemFilterMode) => void
}

/**
 * Controls to toggle between poem filters.
 * @param className Optional additional className values to apply.
 * @param buttonClassName Optional additional className values to apply to the
 * filter buttons.
 * @param filterMode Current filter mode.
 * @param modeOptions Filter mode options.
 * @param setFilterMode Callback to set the filter mode.
 */
export default function PoemFilters({
  className = '',
  buttonClassName = '',
  filterMode,
  modeOptions,
  setFilterMode,
}: Props) {
  return (
    <div className={cn('flex gap-1 min-[370px]:gap-2 md:gap-4', className)}>
      {modeOptions.map((modeOption) => (
        <Button
          key={modeOption}
          className={cn(
            'flex-1 cursor-pointer border-2 border-black/50 p-2 font-bold min-[410px]:text-lg',
            buttonClassName
          )}
          variant={modeOption === filterMode ? 'default' : 'outline'}
          onClick={() => setFilterMode(modeOption)}
        >
          {POEM_FILTER_MODE_LABELS[modeOption]}
        </Button>
      ))}
    </div>
  )
}
