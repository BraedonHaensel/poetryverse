import { Control, Path } from 'react-hook-form'

import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

type HasPoem = { poem: string }

type Props<T extends HasPoem> = {
  control: Control<T>
  showAIDescription?: boolean
}

/**
 * Poem contents field.
 */
export function PoemContentsField<T extends HasPoem>({
  control,
  showAIDescription = false,
}: Props<T>) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name={'poem' as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Poem</FormLabel>
            {showAIDescription && (
              <FormDescription>Customize the generated poem.</FormDescription>
            )}
            <FormControl>
              <Textarea
                className="bg-off-white h-60 resize-none border-2"
                placeholder="Write your poem..."
                maxLength={1000}
                {...field}
              />
            </FormControl>
            <div className="flex justify-between">
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
