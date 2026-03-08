'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

import { LargeButton } from '@/components/large-button'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { CreateFromScratchSchema } from '@/schemas/create-poem-schemas'

import { PoemAIAssistanceField } from './fields/poem-ai-assistance-field'
import { PoemContentsField } from './fields/poem-contents-field'
import { PoemTagsField } from './fields/poem-tags-field'
import { PoemTitleField } from './fields/poem-title-field'
import { PoemTypeField } from './fields/poem-type-field'
import { PoemVisibilityField } from './fields/poem-visibility-field'

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

  const control = form.control

  return (
    <ShadowCard>
      <CardHeader>
        <div className="flex items-center justify-center gap-3">
          <CardTitle className="text-2xl font-bold">
            Create From Scratch
          </CardTitle>
          <Image src="/stylus-icon.svg" alt="" width={40} height={40} />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-x-5 md:grid-cols-2"
          >
            {/* Left column fields */}
            <div className="flex flex-col space-y-3">
              <PoemTypeField control={control} />
              <PoemContentsField control={control} />
            </div>

            {/* Right column fields */}
            <div className="space-y-3">
              <PoemTitleField control={control} />
              <PoemTagsField control={control} />
              <PoemVisibilityField control={control} />
              <PoemAIAssistanceField control={control} />

              {/* Publish button */}
              <LargeButton type="submit">Publish</LargeButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </ShadowCard>
  )
}
