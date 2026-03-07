'use client'

import { useForm } from 'react-hook-form'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactSVG } from 'react-svg'
import { ShadowCard } from '@/components/shadow-card'
import { LargeButton } from '@/components/large-button'

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
      tags: [],
      publicVisibility: true,
      createdWithAI: false,
    },
  })

  // Handle submitting the form
  function onSubmit(data: CreateFromScratchSchema) {
    console.log(`TODO Submit form: ${JSON.stringify(data)}`)
  }

  return (
    <ShadowCard>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
          Create From Scratch <ReactSVG src="/stylus-icon.svg" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2"
          >
            {/* Left column fields */}
            <div>
              {/* Poem type field */}
              <ShadowCard className="p-3">
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
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
                </CardContent>
              </ShadowCard>

              {/* Your Poem field */}
              <ShadowCard className="p-3">
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="poem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Poem</FormLabel>
                        <FormControl className="h-50">
                          <Textarea
                            className="bg-off-white resize-none border-2"
                            placeholder="Write your poem..."
                            maxLength={1000}
                            {...field}
                          />
                        </FormControl>
                        <div className="flex w-full justify-between">
                          <FormMessage />
                          <div className="text-muted-foreground ml-auto text-right text-sm">
                            {field.value?.length ?? 0}/{1000}
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </ShadowCard>
            </div>

            {/* Right column fields */}
            <div>
              {/* Poem title field */}
              <ShadowCard className="p-3">
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="title"
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
                </CardContent>
              </ShadowCard>

              {/* Tags field */}
              <ShadowCard className="p-3">
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <p>TODO Add Tags</p>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </ShadowCard>

              {/* Public Visibility field */}
              <ShadowCard className="p-3">
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="publicVisibility"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between gap-5">
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
                </CardContent>
              </ShadowCard>

              {/* Created With AI Assistance field */}
              <ShadowCard className="p-3">
                <CardContent className="p-0">
                  <FormField
                    control={form.control}
                    name="createdWithAI"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between gap-5">
                        <div>
                          <FormLabel>Created With AI Assistance</FormLabel>
                          <FormDescription>
                            Uphold transparency by admitting whether AI was used
                            in the creation of your poem.
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
                </CardContent>
              </ShadowCard>

              {/* Publish button */}
              <LargeButton type="submit">Publish</LargeButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </ShadowCard>
  )
}
