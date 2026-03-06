'use client'

import { useForm } from 'react-hook-form'
import { CreateFromScratchSchema } from './schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// TODO Hardcoded example, clean up when we can get the poem types from the backend
const POEM_TYPES = ['Haiku', 'Couplet', 'Sonnet']

// Create poems page
export default function Create() {
  // Create poem from scratch form
  const form = useForm<CreateFromScratchSchema>({
    resolver: zodResolver(CreateFromScratchSchema),
    defaultValues: {
      type: '',
      poem: '',
      title: '',
      publicVisibility: true,
      createdWithAI: false,
    },
  })

  // Handle submitting the form
  function onSubmit(data: CreateFromScratchSchema) {
    console.log(`TODO Submit form: ${JSON.stringify(data)}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Poem type field */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a poem type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {POEM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
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

        {/* Your Poem field */}
        <FormField
          control={form.control}
          name="poem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Poem</FormLabel>
              <FormControl className="h-50">
                <Textarea
                  className="resize-none"
                  placeholder="Write your poem..."
                  maxLength={1000}
                  {...field}
                />
              </FormControl>
              <div className="flex w-full justify-between">
                <div className="text-muted-foreground ml-auto text-right text-sm">
                  {field.value?.length ?? 0}/{1000}
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Poem title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title your poem..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Public Visibility field */}
        <FormField
          control={form.control}
          name="publicVisibility"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <FormLabel>Public Visibility</FormLabel>
                <FormDescription>
                  Share your poem with the public.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="scale-150"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Created With AI Assistance field */}
        <FormField
          control={form.control}
          name="createdWithAI"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div>
                <FormLabel>Created With AI Assistance</FormLabel>
                <FormDescription>
                  Uphold transparency by admitting whether AI was used in the
                  creation of your poem.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="scale-150"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Publish button */}
        <Button type="submit">Publish</Button>
      </form>
    </Form>
  )
}
