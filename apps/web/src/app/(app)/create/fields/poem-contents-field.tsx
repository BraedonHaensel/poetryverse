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
import { Textarea } from '@/components/ui/textarea'

type Props = {
  control: Control<CreateFromScratchSchema>
}

/**
 * Poem contents field.
 */
export function PoemContentsField({ control }: Props) {
  return (
    <ShadowCard className="flex-1 p-3">
        <FormField
          control={control}
          name="poem"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-col">
              <FormLabel>Your Poem</FormLabel>
              <FormControl className="flex-1">
                <Textarea
                  className="bg-off-white resize-none border-2"
                  placeholder="Write your poem..."
                  maxLength={1000}
                  {...field}
                />
              </FormControl>
              <div className="flex w-full justify-between">
                <FormMessage />
                <div className="text-muted-foreground ml-auto text-right text-sm">
                  {field.value?.length ?? 0}/{1000}
                </div>
              </div>
            </FormItem>
          )}
        />
    </ShadowCard>
  )
}
