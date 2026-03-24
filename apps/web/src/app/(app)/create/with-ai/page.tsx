'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { LargeButton } from '@/components/large-button'
import { LoadingDialog } from '@/components/loading-dialog'
import MobilePageHeader from '@/components/mobile-page-header'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { api, displayApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import { CreateWithAISchema } from '@/schemas/create-poem-schemas'

import { PoemContentsField } from '../fields/poem-contents-field'
import { PoemPromptField } from '../fields/poem-prompt-field'
import { PoemTagsField } from '../fields/poem-tags-field'
import { PoemTitleField } from '../fields/poem-title-field'
import { PoemTypeField } from '../fields/poem-type-field'
import { PoemVisibilityField } from '../fields/poem-visibility-field'

type CreatePoemWithAIFormProps = {
  form: UseFormReturn<CreateWithAISchema>
  onSubmit: (data: CreateWithAISchema) => void
  isGenerated: boolean
  onGenerateClick: () => void
}

/**
 * Create poem from with AI form.
 */
function CreatePoemWithAIForm({
  form,
  onSubmit,
  isGenerated,
  onGenerateClick,
}: CreatePoemWithAIFormProps) {
  const control = form.control

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn(
        'grid grid-cols-1 gap-x-5',
        isGenerated && 'md:grid-cols-2'
      )}
    >
      {/* Left column fields on desktop */}
      <div className="space-y-2 md:space-y-3">
        <PoemTypeField control={control} />
        <PoemPromptField control={control} />

        {/* Generate/regenerate button */}
        <LargeButton type="button" onClick={onGenerateClick}>
          {isGenerated ? 'Regenerate' : 'Generate'}
        </LargeButton>

        {isGenerated && <PoemTitleField control={control} />}
      </div>

      {/* Right column fields on desktop */}
      {isGenerated && (
        <div className="space-y-2 md:space-y-3">
          <PoemContentsField control={control} showAIDescription />
          <PoemTagsField control={control} />
          <PoemVisibilityField control={control} />

          {/* Publish button */}
          <LargeButton type="submit">Publish</LargeButton>
        </div>
      )}
    </form>
  )
}

/**
 * Create poem with AI page.
 */
export default function CreatePoemWithAI() {
  // Whether an AI poem has been generated
  const [isGenerated, setIsGenerated] = useState(false)
  // Whether the AI poem generation is in progress
  const [isGenerating, setIsGenerating] = useState(false)
  // Whether the regenerate poem confirmation is open
  const [isRegenConfirmOpen, setIsRegenConfirmOpen] = useState(false)

  // Create poem with AI form
  const form = useForm<CreateWithAISchema>({
    resolver: zodResolver(CreateWithAISchema),
    defaultValues: {
      typeId: '',
      prompt: '',
      title: '',
      poem: '',
      tagIds: [],
      publicVisibility: true,
    },
  })

  async function validateAIGenerationFields(): Promise<boolean> {
    return form.trigger(['typeId', 'prompt'])
  }

  // Handle generating an AI poem from the current prompt
  async function generate() {
    // Validate the poem type and AI prompt
    if (!(await validateAIGenerationFields())) return

    // Send an API request to generate the poem
    setIsGenerating(true)
    const { typeId, prompt } = form.getValues()
    api
      .post(
        '/api/poems/generate',
        { typeId, prompt },
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

  // Handle clicking the Generate button.
  async function handleGenerateClick() {
    if (!isGenerated) {
      generate()
      return
    }
    // Poem previously generated. Validate fields and open confirmation
    const isValid = await validateAIGenerationFields()
    if (isValid) setIsRegenConfirmOpen(true)
  }

  return (
    <>
      <LoadingDialog isOpen={isGenerating} message="Generating poem..." />
      <ConfirmationDialog
        isOpen={isRegenConfirmOpen}
        title="Are you sure you want to regenerate?"
        description="Regenerating will overwrite your current poem."
        onClose={() => setIsRegenConfirmOpen(false)}
        onAction={generate}
      />
      <Form {...form}>
        {/* Mobile layout */}
        <div className="flex flex-1 flex-col md:hidden">
          <MobilePageHeader title="Create With AI" image="/robot-icon.svg" />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <CreatePoemWithAIForm
              form={form}
              onSubmit={onSubmit}
              isGenerated={isGenerated}
              onGenerateClick={handleGenerateClick}
            />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="m-auto hidden w-full p-10 md:block">
          <ShadowCard
            className={cn('m-auto max-w-170', isGenerated && 'max-w-6xl')}
          >
            <CardHeader>
              <div className="flex items-center justify-center gap-3">
                <CardTitle className="text-2xl font-bold">
                  Create With AI
                </CardTitle>
                <Image src="/robot-icon.svg" alt="" width={40} height={40} />
              </div>
            </CardHeader>
            <CardContent>
              <CreatePoemWithAIForm
                form={form}
                onSubmit={onSubmit}
                isGenerated={isGenerated}
                onGenerateClick={handleGenerateClick}
              />
            </CardContent>
          </ShadowCard>
        </div>
      </Form>
    </>
  )
}
