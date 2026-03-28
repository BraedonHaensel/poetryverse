'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { LoadingDialog } from '@/components/loading-dialog'
import MobilePageHeader from '@/components/mobile-page-header'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { api, displayApiError } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  CreateFromScratchSchema,
  CreateWithAISchema,
} from '@/schemas/create-poem-schemas'

import CreatePoemWithAIForm from './with-ai-form'

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

  const [isPublishing, setIsPublishing] = useState(false)
  const router = useRouter()

  useEffect((): (() => void) => {
    // Prevent the body scrollbar from appearing, as the page has its own scrollbar
    document.body.style.overflow = 'hidden'
    // Restore the body scrollbar upon leaving the page
    return () => (document.body.style.overflow = '')
  }, [])

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
      .post('/api/poems/generate', { typeId, prompt })
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

  // Handle submitting the form (publishing a poem)
  function onSubmit(data: CreateWithAISchema) {
    setIsPublishing(true)

    // Discard the prompt field, and indicated it was created with AI
    const { prompt: _, ...rest } = data
    const submissionData: CreateFromScratchSchema = {
      ...rest,
      createdWithAI: true,
    }

    console.log('Publishing poem:', submissionData)
    api
      .post('/api/poems', submissionData)
      .then((response) => {
        // Publish successful
        const data = response.data.data
        console.log('Poem published successfully:', data)
        toast.success('Poem published successfully')
        router.push('/profile')
      })
      .catch((error) => {
        displayApiError(error, 'Failed to publish poem')
      })
      .finally(() => {
        setIsPublishing(false)
      })
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
      <LoadingDialog isOpen={isPublishing} message="Publishing poem..." />
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
