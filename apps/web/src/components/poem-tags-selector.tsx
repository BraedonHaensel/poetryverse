'use client'

import { X } from 'lucide-react'

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox'

// TODO Hardcoded example, clean up when we can get poem tags from the backend.
const POEM_TAGS = [
  { id: 'nature', name: 'Nature' },
  { id: 'romance', name: 'Romance' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'parody', name: 'Parody' },
]
const POEM_TAG_IDS = POEM_TAGS.map((tag) => tag.id)
const POEM_TAG_NAMES_BY_ID = Object.fromEntries(
  POEM_TAGS.map((tag) => [tag.id, tag.name])
) as Record<string, string>

type Props = {
  selectedTagIds: string[]
  onChange: (selection: string[]) => void
  isInvalid: boolean
}

/**
 * Poem tags multi-select.
 * @param selectedTagIds The list of currently selected tag ids.
 * @param onChange Callback for handling selection changes.
 * @param isInvalid Whether the validation styles should be displayed.
 */
export function PoemTagsSelector({
  selectedTagIds,
  onChange,
  isInvalid = false,
}: Props) {
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      autoHighlight
      items={POEM_TAG_IDS}
      value={selectedTagIds}
      onValueChange={onChange}
    >
      <ComboboxChips
        ref={anchor}
        // Override the default padding to fit the clear button
        className={`bg-off-white relative border-2 py-2! pr-8! pl-3! ${
          isInvalid ? 'border-destructive! ring-destructive/20!' : ''
        }`}
      >
        <ComboboxValue>
          {selectedTagIds.map((tagId) => (
            <ComboboxChip key={tagId} className="bg-gray-300 text-sm">
              {POEM_TAG_NAMES_BY_ID[tagId] ?? tagId}
            </ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput
          className="h-6"
          placeholder={selectedTagIds.length === 0 ? 'Add poem tags...' : ''}
        />
        {/* Clear button */}
        {selectedTagIds.length > 0 && (
          <X
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
            size={18}
            onClick={() => onChange([])}
          />
        )}
      </ComboboxChips>
      {/* Select dropdown */}
      <ComboboxContent anchor={anchor} className="bg-off-white">
        <ComboboxEmpty>No tags found.</ComboboxEmpty>
        <ComboboxList>
          {(tagId) => (
            <ComboboxItem
              key={tagId}
              className="data-highlighted:bg-gray-200"
              value={tagId}
            >
              {POEM_TAG_NAMES_BY_ID[tagId] ?? tagId}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
