'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { signOut } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UsernameSchema } from '@/schemas/user-settings-schemas'

/**
 * Set username form.
 */
export default function UsernameForm() {
  // Username form
  const form = useForm<UsernameSchema>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: '',
    },
  })

  // Handle submitting the form
  function onSubmit(data: UsernameSchema) {
    console.log(`TODO Submit form: ${JSON.stringify(data)}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <p className="mb-8 text-center text-xl">
          Choose a unique username to display to other poets.
        </p>

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="h-20 border-4 text-2xl"
                  placeholder="Enter a username..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-muted-foreground text-center">
          You can change this later in your settings.
        </p>
        <Button
          className="h-auto w-full cursor-pointer py-6 text-2xl whitespace-normal"
          type="submit"
        >
          Confirm
        </Button>
        <Button
          className="text-muted-foreground cursor-pointer text-lg"
          variant="link"
          onClick={() => {
            signOut()
          }}
        >
          ← Sign out
        </Button>
      </form>
    </Form>
  )
}
