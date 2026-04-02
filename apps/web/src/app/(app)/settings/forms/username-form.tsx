'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { ShadowCard } from '@/components/shadow-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UsernameSchema } from '@/schemas/user-settings-schemas'

type Props = {
  username: string
  onUsernameSubmit: (username: string) => Promise<void>
}

/**
 * Username form.
 */
export function UsernameForm({ username, onUsernameSubmit }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // Username form
  const form = useForm<UsernameSchema>({
    resolver: zodResolver(UsernameSchema),
    defaultValues: {
      username,
    },
  })

  // Handle submitting the username change
  async function onSubmit(data: UsernameSchema) {
    if (data.username === username) {
      // Username did not change
      setIsOpen(false)
      return
    }

    await onUsernameSubmit(data.username)
    setIsOpen(false)
  }

  const control = form.control

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        if (val) form.reset()
        setIsOpen(val)
      }}
    >
      <ShadowCard className="gap-2 p-3">
        <Label>Username</Label>

        <DialogTrigger className="bg-off-white relative">
          <Input
            className="truncate border-2 pr-8 hover:cursor-pointer"
            value={username}
            readOnly
          />
          <Pencil
            size={20}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 hover:cursor-pointer"
          />
        </DialogTrigger>
      </ShadowCard>
      <DialogContent showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Username</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className="bg-off-white border-2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex sm:justify-between">
          <DialogClose asChild>
            <Button
              className="hover:cursor-pointer"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="hover:cursor-pointer"
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
