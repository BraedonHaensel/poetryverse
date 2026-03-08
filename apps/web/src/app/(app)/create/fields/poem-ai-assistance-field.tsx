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
 * Poem AI assistance field.
 */
export function PoemAIAssistanceField({ control }: Props) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name="createdWithAI"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between gap-5">
            <div>
              <FormLabel>Created With AI Assistance</FormLabel>
              <FormDescription>
                Uphold transparency by admitting whether AI was used in the
                creation of your poem.
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
