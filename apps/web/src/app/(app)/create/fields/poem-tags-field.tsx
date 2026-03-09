import { Control, Path } from 'react-hook-form'

import { PoemTagsSelector } from '@/components/poem-tags-selector'
import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

type HasTags = { tags: string[] }

type Props<T extends HasTags> = {
  control: Control<T>
}

/**
 * Poem tags field.
 */
export function PoemTagsField<T extends HasTags>({ control }: Props<T>) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name={'tags' as Path<T>}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <PoemTagsSelector
                selectedTags={field.value as string[]}
                onChange={field.onChange}
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
