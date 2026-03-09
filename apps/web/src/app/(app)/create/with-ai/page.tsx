'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { LargeButton } from '@/components/large-button'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { api, displayApiError } from '@/lib/api'
import { CreateWithAISchema } from '@/schemas/create-poem-schemas'

import { PoemContentsField } from '../fields/poem-contents-field'
import { PoemPromptField } from '../fields/poem-prompt-field'
import { PoemTagsField } from '../fields/poem-tags-field'
import { PoemTitleField } from '../fields/poem-title-field'
import { PoemTypeField } from '../fields/poem-type-field'
import { PoemVisibilityField } from '../fields/poem-visibility-field'

/**
 * Create poem with AI page.
 */
export default function CreatePoemWithAI() {
  // Whether an AI poem has been generated
  const [isGenerated, setIsGenerated] = useState<boolean>(false)
  // Whether the AI poem generation is in progress
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // Create poem with AI form
  const form = useForm<CreateWithAISchema>({
    resolver: zodResolver(CreateWithAISchema),
    defaultValues: {
      type: '',
      prompt: '',
      title: '',
      poem: '',
      tags: [],
      publicVisibility: true,
    },
  })

  // Handle generating an AI poem from the current prompt
  async function generate() {
    // Validate the poem type and AI prompt
    const isValid = await form.trigger(['type', 'prompt'])
    if (!isValid) return

    // Send an API request to generate the poem
    setIsGenerated(false)
    setIsGenerating(true)
    const { type, prompt } = form.getValues()
    api
      .post(
        '/api/poems/generate',
        { type, prompt },
        {
          headers: {
            Authorization: `Bearer ${'<TODO GET AUTH TOKEN>'}`,
          },
        }
      )
      .then((response) => {
        // Parse the generated poem from the response
        const data = response.data.data
        const { title, poem } = data
        form.setValue('title', title)
        form.setValue('poem', poem)
        setIsGenerated(true)
      })
      .catch((error) => {
        displayApiError(error, 'Failed to generate poem')
      })
      .finally(() => {
        setIsGenerating(false)
      })
  }

  // Handle submitting the completed form
  function onSubmit(data: CreateWithAISchema) {
    console.log(`TODO Submit form: ${JSON.stringify(data)}`)
  }

  const control = form.control

  return (
    <ShadowCard className={`m-auto ${!isGenerated ? 'w-150' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-center gap-3">
          <CardTitle className="text-2xl font-bold">Create With AI</CardTitle>
          <Image src="/robot-icon.svg" alt="" width={40} height={40} />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`grid grid-cols-1 gap-x-5 ${isGenerated ? 'md:grid-cols-2' : ''}`}
          >
            {/* Left column fields */}
            <div className="space-y-3">
              <PoemTypeField control={control} />
              <PoemPromptField control={control} />
              {/* Generate button */}
              <LargeButton type="button" onClick={generate}>
                {isGenerated ? 'Regenerate' : 'Generate'}
              </LargeButton>
              {isGenerated && <PoemTitleField control={control} />}
            </div>

            {/* Right column fields */}
            {isGenerated && (
              <div className="space-y-3">
                <PoemContentsField control={control} showAIDescription />
                <PoemTagsField control={control} />
                <PoemVisibilityField control={control} />

                {/* Publish button */}
                <LargeButton type="submit">Publish</LargeButton>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </ShadowCard>
  )
}
