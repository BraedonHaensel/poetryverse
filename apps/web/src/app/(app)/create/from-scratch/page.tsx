'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import { LargeButton } from '@/components/large-button'
import MobilePageHeader from '@/components/mobile-page-header'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { CreateFromScratchSchema } from '@/schemas/create-poem-schemas'

import { PoemAIAssistanceField } from '../fields/poem-ai-assistance-field'
import { PoemContentsField } from '../fields/poem-contents-field'
import { PoemTagsField } from '../fields/poem-tags-field'
import { PoemTitleField } from '../fields/poem-title-field'
import { PoemTypeField } from '../fields/poem-type-field'
import { PoemVisibilityField } from '../fields/poem-visibility-field'

type CreatePoemFromScratchFormProps = {
  form: UseFormReturn<CreateFromScratchSchema>
  onSubmit: (data: CreateFromScratchSchema) => void
}

/**
 * Create poem from scratch form.
 */
function CreatePoemFromScratchForm({
  form,
  onSubmit,
}: CreatePoemFromScratchFormProps) {
  const control = form.control

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-2"
    >
      {/* Left column fields on desktop */}
      <div className="space-y-2 md:space-y-3">
        <PoemTypeField control={control} />
        <PoemContentsField control={control} />
      </div>

      {/* Right column fields on desktop */}
      <div className="space-y-2 md:space-y-3">
        <PoemTitleField control={control} />
        <PoemTagsField control={control} />
        <PoemVisibilityField control={control} />
        <PoemAIAssistanceField control={control} />

        {/* Publish button */}
        <LargeButton type="submit">Publish</LargeButton>
      </div>
    </form>
  )
}

/**
 * Create poem from scratch page.
 */
export default function CreatePoemFromScratch() {
  useEffect((): (() => void) => {
    // Prevent the body scrollbar from appearing, as the page has its own scrollbar
    document.body.style.overflow = 'hidden'
    // Restore the body scrollbar upon leaving the page
    return () => (document.body.style.overflow = '')
  }, [])

  // Create poem from scratch form
  const form = useForm<CreateFromScratchSchema>({
    resolver: zodResolver(CreateFromScratchSchema),
    defaultValues: {
      typeId: '',
      poem: '',
      title: '',
      tagIds: [],
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
      {/* Mobile layout */}
      <div className="flex flex-1 flex-col md:hidden">
        <MobilePageHeader
          title="Create From Scratch"
          image="/stylus-icon.svg"
          className="max-[340]:text-[22px]"
        />
        <div className="flex flex-1 flex-col gap-2 p-4">
          <CreatePoemFromScratchForm form={form} onSubmit={onSubmit} />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="m-auto hidden w-full p-10 md:block">
        <ShadowCard className="m-auto max-w-6xl">
          <CardHeader>
            <div className="flex items-center justify-center gap-3">
              <CardTitle className="text-2xl font-bold">
                Create From Scratch
              </CardTitle>
              <Image src="/stylus-icon.svg" alt="" width={40} height={40} />
            </div>
          </CardHeader>
          <CardContent>
            <CreatePoemFromScratchForm form={form} onSubmit={onSubmit} />
          </CardContent>
        </ShadowCard>
      </div>
    </Form>
  )
}
