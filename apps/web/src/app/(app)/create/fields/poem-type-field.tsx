import { Control } from 'react-hook-form'

import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'

// TODO Hardcoded example, clean up when we can get the poem types from the backend
const POEM_TYPES = ['Haiku', 'Couplet', 'Sonnet']

type Props = {
  control: Control<CreateFromScratchSchema>
}

/**
 * Poem type field.
 */
export function PoemTypeField({ control }: Props) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  aria-invalid={!!fieldState.error}
                  className={`bg-off-white w-full border-2 hover:cursor-pointer ${
                    fieldState.error ? 'border-destructive' : ''
                  }`}
                >
                  <SelectValue placeholder="Select a poem type..." />
                </SelectTrigger>
                <SelectContent className="bg-off-white">
                  {POEM_TYPES.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="data-highlighted:bg-gray-200"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ShadowCard>
  )
}
