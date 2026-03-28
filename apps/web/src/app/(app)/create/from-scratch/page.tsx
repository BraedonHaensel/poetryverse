'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { LoadingDialog } from '@/components/loading-dialog'
import MobilePageHeader from '@/components/mobile-page-header'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { api, displayApiError } from '@/lib/api'
import { CreateFromScratchSchema } from '@/schemas/create-poem-schemas'

import CreatePoemFromScratchForm from './from-scratch-form'

/**
 * Create poem from scratch page.
 */
export default function CreatePoemFromScratch() {
  const [isPublishing, setIsPublishing] = useState(false)
  const router = useRouter()

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

  // Handle submitting the form (publishing a poem)
  function onSubmit(data: CreateFromScratchSchema) {
    setIsPublishing(true)
    console.log('Publishing poem:', data)
    api
      .post('/api/poems', data)
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

  return (
    <>
      <LoadingDialog isOpen={isPublishing} message="Publishing poem..." />
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
    </>
  )
}
