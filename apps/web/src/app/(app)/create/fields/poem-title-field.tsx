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
import { Input } from '@/components/ui/input'

type Props = {
  control: Control<CreateFromScratchSchema>
}

/**
 * Poem title field.
 */
export function PoemTitleField({ control }: Props) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input
                className="bg-off-white border-2"
                placeholder="Title your poem..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ShadowCard>
  )
}
