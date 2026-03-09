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
import { Textarea } from '@/components/ui/textarea'
import { CreateWithAISchema } from '@/schemas/create-poem-schemas'

type Props = {
  control: Control<CreateWithAISchema>
}

/**
 * Poem AI prompt field.
 */
export function PoemPromptField({ control }: Props) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>AI Prompt</FormLabel>
            <FormDescription>
              Describe the poem for AI to generate.
            </FormDescription>
            <FormControl>
              <Textarea
                className="bg-off-white h-60 resize-none border-2"
                placeholder="Create a poem about..."
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
