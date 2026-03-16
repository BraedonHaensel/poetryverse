import { Control, Path } from 'react-hook-form'

import { ShadowCard } from '@/components/shadow-card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type HasTitle = { title: string }

type Props<T extends HasTitle> = {
  control: Control<T>
}

/**
 * Poem title field.
 */
export function PoemTitleField<T extends HasTitle>({ control }: Props<T>) {
  return (
    <ShadowCard className="p-3">
      <FormField
        control={control}
        name={'title' as Path<T>}
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
