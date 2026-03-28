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
import { PoemType } from '@/lib/poem-requests'

type HasTypeId = { typeId: string }

type Props<T extends HasTypeId> = {
  control: Control<T>
  poemTypes: PoemType[]
}

/**
 * Poem type field.
 */
export function PoemTypeField<T extends HasTypeId>({
  control,
  poemTypes,
}: Props<T>) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name={'typeId' as Path<T>}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(val) => {
                  if (poemTypes.length === 0) return
                  field.onChange(val)
                }}
              >
                <SelectTrigger
                  aria-invalid={!!fieldState.error}
                  className={`bg-off-white w-full border-2 hover:cursor-pointer ${
                    fieldState.error ? 'border-destructive' : ''
                  }`}
                >
                  <SelectValue placeholder="Select a poem type..." />
                </SelectTrigger>

                <SelectContent className="bg-off-white">
                  {poemTypes.length === 0 ? (
                    <SelectItem
                      value={'none'}
                      className="data-highlighted:bg-gray-200"
                    >
                      Loading...
                    </SelectItem>
                  ) : (
                    poemTypes.map((type) => (
                      <SelectItem
                        key={type.name}
                        value={type.id}
                        className="data-highlighted:bg-gray-200"
                      >
                        {type.name}
                      </SelectItem>
                    ))
                  )}
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
