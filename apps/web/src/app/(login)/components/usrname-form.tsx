'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState } from 'react'
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
import { displayApiError } from '@/lib/api'
import { UsernameSchema } from '@/schemas/user-settings-schemas'

/**
 * Set username form.
 */
export default function UsernameForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Username form
  const form = useForm<UsernameSchema>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username: '',
    },
  })

  // Handle submitting the form
  function onSubmit(data: UsernameSchema) {
    setIsLoading(true)
    axios
      .post('/api/username', { username: data.username })
      .then(() => router.push('/home'))
      .catch((error) => {
        displayApiError(error, 'Failed to set username')
      })
      .finally(() => setIsLoading(false))
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
                  className="h-18 border-4 text-xl!"
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
          className="h-auto w-full cursor-pointer py-4 text-2xl whitespace-normal"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <LoaderCircle className="h-8! w-8! animate-spin" />
          ) : (
            'Confirm'
          )}
        </Button>
        <Button
          className="text-muted-foreground cursor-pointer"
          variant="link"
          type="button"
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
