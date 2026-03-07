import { Control } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ShadowCard } from '@/components/shadow-card'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'
import { Switch } from '@/components/ui/switch'

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
