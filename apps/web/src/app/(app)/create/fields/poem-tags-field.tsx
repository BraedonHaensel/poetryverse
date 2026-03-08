'use client'

import { Control } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ShadowCard } from '@/components/shadow-card'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'
import { PoemTagsSelector } from '@/components/poem-tags-selector'

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
