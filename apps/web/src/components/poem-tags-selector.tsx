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

// TODO Hardcoded example, clean up when we can get the poem tags from the backend
const POEM_TAGS = ['Nature', 'Romance', 'Comedy', 'Parody']

type Props = {
  selectedTags: string[]
  onChange: (selection: string[]) => void
  isInvalid: boolean
}

/**
 * Poem tags multi-select.
 * @param selectedTags The list of currently selected tags.
 * @param onChange Callback for handling selection changes.
 * @param isInvalid Whether the validation styles should be displayed.
 */
export function PoemTagsSelector({
  selectedTags,
  onChange,
  isInvalid = false,
}: Props) {
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      autoHighlight
      items={POEM_TAGS}
      value={selectedTags}
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
          {selectedTags.map((tag) => (
            <ComboboxChip key={tag} className="bg-gray-300 text-sm">
              {tag}
            </ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput
          className="h-6"
          placeholder={selectedTags.length === 0 ? 'Add poem tags...' : ''}
        />
        {/* Clear button */}
        {selectedTags.length > 0 && (
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
          {(tag) => (
            <ComboboxItem
              key={tag}
              className="data-highlighted:bg-gray-200"
              value={tag}
            >
              {tag}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
