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
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <p>TODO Add Tags</p>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ShadowCard>
  )
}
