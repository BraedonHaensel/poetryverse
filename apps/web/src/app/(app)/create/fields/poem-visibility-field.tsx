import { Control } from 'react-hook-form'

import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { CreateFromScratchSchema } from '@/schemas/create-poem-schemas'

type Props = {
  control: Control<CreateFromScratchSchema>
}

/**
 * Poem visibility field.
 */
export function PoemVisibilityField({ control }: Props) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name="publicVisibility"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between gap-5">
            <div>
              <FormLabel>Public Visibility</FormLabel>
              <FormDescription>
                Share your poem with the public.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                className="hover:cursor-pointer"
                size="lg"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ShadowCard>
  )
}
