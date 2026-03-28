import { Control, Path, useFormContext } from 'react-hook-form'

import { PoemTagsSelector } from '@/components/poem-tags-selector'
import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { MAX_TAGS } from '@/schemas/create-poem-schemas'

type HasTagIds = { tagIds: string[] }

type Props<T extends HasTagIds> = {
  control: Control<T>
}

/**
 * Poem tags field.
 */
export function PoemTagsField<T extends HasTagIds>({ control }: Props<T>) {
  const { trigger } = useFormContext<T>()

  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name={'tagIds' as Path<T>}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <PoemTagsSelector
                selectedTagIds={field.value as string[]}
                onChange={async (val) => {
                  // Prevent adding excess tags (+1 so the validation error appears)
                  if (val.length > MAX_TAGS + 1) return
                  field.onChange(val)
                  // Validate the number of tags added
                  await trigger('tagIds' as Path<T>)
                }}
                isInvalid={!!fieldState.error}
              />
            </FormControl>
            <FormMessage>{fieldState?.error?.message}</FormMessage>
          </FormItem>
        )}
      />
    </ShadowCard>
  )
}
