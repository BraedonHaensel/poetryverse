import { Control } from 'react-hook-form'

import { PoemTagsSelector } from '@/components/poem-tags-selector'
import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'

type Props = {
  control: Control<CreateFromScratchSchema>
}

/**
 * Poem tags field.
 */
export function PoemTagsField({ control }: Props) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name="tags"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <PoemTagsSelector
                selectedTags={field.value}
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
