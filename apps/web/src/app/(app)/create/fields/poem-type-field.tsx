import { Control, Path } from 'react-hook-form'

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

// TODO Hardcoded example, clean up when we can get the poem types from the backend
const POEM_TYPES = ['Haiku', 'Couplet', 'Sonnet']

type HasType = { type: string }

type Props<T extends HasType> = {
  control: Control<T>
}

/**
 * Poem type field.
 */
export function PoemTypeField<T extends HasType>({ control }: Props<T>) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name={'type' as Path<T>}
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
