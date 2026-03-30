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
  mode: PoemFilterMode
  modeOptions: PoemFilterMode[]
  setMode: (mode: PoemFilterMode) => void
}

/**
 * Controls to toggle between poem filters.
 * @param className Optional additional className values to apply.
 * @param mode Current filter mode.
 * @param modeOptions Filter mode options.
 * @param setMode Callback to set the filter mode.
 */
export default function PoemFilters({
  className = '',
  mode,
  modeOptions,
  setMode,
}: Props) {
  return (
    <div className={cn('flex gap-2 md:gap-4', className)}>
      {modeOptions.map((modeOption) => (
        <Button
          key={modeOption}
          className={
            'flex-1 cursor-pointer border-2 border-black/50 text-lg font-bold md:max-w-50'
          }
          variant={modeOption === mode ? 'default' : 'outline'}
          onClick={() => setMode(modeOption)}
        >
          {POEM_FILTER_MODE_LABELS[modeOption]}
        </Button>
      ))}
    </div>
  )
}
