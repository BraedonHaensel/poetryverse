'use client'

import { Control, useController } from 'react-hook-form'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ShadowCard } from '@/components/shadow-card'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'
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
import { X } from 'lucide-react'

// TODO Hardcoded example, clean up when we can get the poem tags from the backend
const POEM_TAGS = ['Nature', 'Romance', 'Comedy', 'Parody']

type Props = {
  control: Control<CreateFromScratchSchema>
}

/**
 * Poem tags field.
 */
export function PoemTagsField({ control }: Props) {
  const anchor = useComboboxAnchor()

  const { field, fieldState } = useController({
    control,
    name: 'tags',
  })

  return (
    <ShadowCard className="p-3">
      <FormItem>
        <FormLabel>Tags</FormLabel>
        <FormControl>
          <Combobox
            multiple
            autoHighlight
            items={POEM_TAGS}
            value={field.value}
            onValueChange={field.onChange}
          >
            <ComboboxChips
              ref={anchor}
              // Override the default padding to fit the clear button
              className={`bg-off-white relative border-2 py-2! pr-8! pl-3! ${
                fieldState.error
                  ? 'border-destructive! ring-destructive/20!'
                  : ''
              }`}
            >
              <ComboboxValue>
                {field.value.map((tag) => (
                  <ComboboxChip key={tag} className="bg-gray-300 text-sm">
                    {tag}
                  </ComboboxChip>
                ))}
              </ComboboxValue>
              <ComboboxChipsInput
                className="h-6"
                placeholder={field.value.length === 0 ? 'Add poem tags...' : ''}
              />
              {/* Clear button */}
              {field.value.length > 0 && (
                <X
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                  size={18}
                  onClick={() => field.onChange([])}
                />
              )}
            </ComboboxChips>
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
        </FormControl>
        <FormMessage>{fieldState?.error?.message}</FormMessage>
      </FormItem>
    </ShadowCard>
  )
}
