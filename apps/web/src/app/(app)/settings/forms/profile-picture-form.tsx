'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
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
import { api } from '@/lib/api'
import { ProfilePictureSchema } from '@/schemas/user-settings-schemas'

type Props = {
  imageUrl: string
}

/**
 * Profile picture form.
 */
export function ProfilePictureForm({ imageUrl }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('')

  // Profile picture form
  const form = useForm<ProfilePictureSchema>({
    resolver: zodResolver(ProfilePictureSchema),
    defaultValues: {
      imageFile: undefined,
    },
  })

  // Handle submitting the profile picture change
  async function onSubmit(data: ProfilePictureSchema) {
    // Use a FormData to handle uploading the profile picture image file
    const formData = new FormData()
    formData.append('image', data.imageFile)

    // TODO sent to backend
    const _ = await api.patch('/TODO', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${'TODO'}`,
      },
    })
    setIsOpen(false)
  }

  const control = form.control

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(val) => {
        if (val) {
          form.reset()
          setImagePreviewUrl('')
        }
        setIsOpen(val)
      }}
    >
      <ShadowCard className="gap-2 p-3">
        <div className="flex justify-between">
          <Label>Profile Picture</Label>
          <DialogTrigger>
            <Pencil
              size={20}
              className="text-muted-foreground hover:text-foreground hover:cursor-pointer"
            />
          </DialogTrigger>
        </div>
        <DialogTrigger className="mx-auto w-fit">
          <Image
            className="rounded-full border-2 hover:cursor-pointer hover:opacity-70"
            src={imageUrl}
            loading="eager"
            alt="Profile picture"
            width={80}
            height={80}
          />
        </DialogTrigger>
      </ShadowCard>
      <DialogContent showCloseButton={false} aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Profile Picture</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form>
            <FormField
              control={control}
              name="imageFile"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className="mx-auto w-fit"
                      onClick={() => {
                        const input =
                          document.getElementById('upload-image-input')
                        input?.click()
                      }}
                    >
                      <Image
                        className="rounded-full border-2 hover:cursor-pointer hover:opacity-70"
                        src={
                          imagePreviewUrl ? imagePreviewUrl : '/upload-icon.svg'
                        }
                        alt="Profile picture upload"
                        width={120}
                        height={120}
                        onClick={() => {}}
                      />
                      <Input
                        id="upload-image-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setImagePreviewUrl(URL.createObjectURL(file))
                            field.onChange(file)
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
