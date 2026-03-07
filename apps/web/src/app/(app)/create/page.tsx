'use client'

import { useForm } from 'react-hook-form'
import { CreateFromScratchSchema } from '@/schemas/createPoemSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactSVG } from 'react-svg'
import { ShadowCard } from '@/components/shadow-card'
import { LargeButton } from '@/components/large-button'
import { PoemTypeField } from './fields/poem-type-field'
import { PoemContentsField } from './fields/poem-contents-field'
import { PoemTitleField } from './fields/poem-title-field'
import { PoemTagsField } from './fields/poem-tags-field'
import { PoemVisibilityField } from './fields/poem-visibility-field'
import { PoemAIAssistanceField } from './fields/poem-ai-assistance-field'

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
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold">
          Create From Scratch <ReactSVG src="/stylus-icon.svg" />
        </CardTitle>
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
