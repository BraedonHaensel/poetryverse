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

type HasTagIds = { tagIds: string[] }

type Props<T extends HasTagIds> = {
  control: Control<T>
}

/**
 * Poem tags field.
 */
export function PoemTagsField<T extends HasTagIds>({ control }: Props<T>) {
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
