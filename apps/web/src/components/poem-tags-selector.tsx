'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

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
import { PoemTag } from '@/lib/poem-requests'

type Props = {
  poemTags: PoemTag[]
  selectedTagIds: string[]
  onChange: (selection: string[]) => void
  isInvalid: boolean
}

/**
 * Poem tags multi-select.
 * @param poemTags The list of all poem tag objects.
 * @param selectedTagIds The list of currently selected tag IDs.
 * @param onChange Callback for handling selection changes.
 * @param isInvalid Whether the validation styles should be displayed.
 */
export function PoemTagsSelector({
  poemTags,
  selectedTagIds,
  onChange,
  isInvalid = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const anchor = useComboboxAnchor()

  // Gets the PoemTag object for a given tag ID
  const tagIdToObj = (tagId: PoemTag['id']) => {
    const tag = poemTags.find((tag) => tag.id === tagId)
    if (tag !== undefined) return tag
    console.error('Unknown tag ID:', tagId)
    return { id: '', name: '' }
  }

  return (
    <Combobox
      multiple
      autoHighlight
      items={poemTags}
      value={selectedTagIds.map(tagIdToObj)}
      onValueChange={(tags: PoemTag[]) => onChange(tags.map((tag) => tag.id))}
      open={isOpen}
      onOpenChange={setIsOpen}
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
              {tagIdToObj(tagId).name}
            </ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput
          className="h-6"
          placeholder={selectedTagIds.length === 0 ? 'Add poem tags...' : ''}
          onFocus={() => setIsOpen(true)}
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
        <ComboboxEmpty>Loading...</ComboboxEmpty>
        <ComboboxList>
          {(tag) => (
            <ComboboxItem
              key={tag.id}
              className="data-highlighted:bg-gray-200"
              value={tag}
            >
              {tag.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
