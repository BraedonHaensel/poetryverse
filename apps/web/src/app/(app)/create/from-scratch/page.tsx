'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { LoadingDialog } from '@/components/loading-dialog'
import MobilePageHeader from '@/components/mobile-page-header'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { api, displayApiError } from '@/lib/api'
import {
  getPoemTags,
  getPoemTypes,
  PoemTag,
  PoemType,
} from '@/lib/poem-requests'
import { CreateFromScratchSchema } from '@/schemas/create-poem-schemas'

import CreatePoemFromScratchForm from './from-scratch-form'

const LOCAL_STORAGE_BACKUP_KEY = 'scratch-poem-backup'

/**
 * Create poem from scratch page.
 */
export default function CreatePoemFromScratch() {
  const [isPublishing, setIsPublishing] = useState(false)
  const [poemTypes, setPoemTypes] = useState<PoemType[]>()
  const [poemTags, setPoemTags] = useState<PoemTag[]>()
  const router = useRouter()

  useEffect((): (() => void) => {
    // Prevent the body scrollbar from appearing, as the page has its own scrollbar
    document.body.style.overflowY = 'hidden'
    // Restore the body scrollbar upon leaving the page
    return () => (document.body.style.overflow = '')
  }, [])

  // Get the list of poem tags and types from the API
  const didFetch = useRef(false)
  useEffect(() => {
    if (didFetch.current) return // Prevent double fetch in strict mode
    didFetch.current = true

    getPoemTypes().then(setPoemTypes)
    getPoemTags().then(setPoemTags)
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

  // Try loading a form backup from local storage
  useEffect(() => {
    try {
      const backup = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY)
      if (backup) form.reset(JSON.parse(backup))
    } catch (e) {
      console.error('Failed to load poem backup:', e)
    }
  }, [form])

  // Save backups of form changes to local storage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const autosave = form.watch((value) => {
      try {
        localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(value))
      } catch (e) {
        console.error('Failed to save poem backup:', e)
      }
    })

    return () => autosave.unsubscribe()
  }, [form])

  /**
   * Handle submitting the form (publishing a poem).
   * @param data The form data to submit.
   */
  function onSubmit(data: CreateFromScratchSchema) {
    setIsPublishing(true)
    console.log('Publishing poem:', data)
    api
      .post('/api/poems', data)
      .then((response) => {
        // Publish successful
        const data = response.data.data
        console.log('Poem published successfully:', data)

        // Clear the local backup
        localStorage.removeItem(LOCAL_STORAGE_BACKUP_KEY)

        router.push('/profile')
        toast.success('Poem published successfully')
        // Note: isPublishing is kept false to prevent resubmits
      })
      .catch((error) => {
        displayApiError(error, 'Failed to publish poem')
        setIsPublishing(false)
      })
  }

  // Wait for the poem types and tags to load
  if (poemTypes === undefined || poemTags === undefined)
    return <PageLoadingIndicator />

  return (
    <>
      <LoadingDialog isOpen={isPublishing} message="Publishing poem..." />
      <Form {...form}>
        {/* Mobile layout */}
        <div className="flex flex-1 flex-col md:hidden">
          <MobilePageHeader
            title="Create From Scratch"
            image="/stylus-icon.svg"
            className="max-[360px]:text-[22px]"
          />
          <div className="flex flex-1 flex-col gap-2 p-4">
            <CreatePoemFromScratchForm
              form={form}
              onSubmit={onSubmit}
              poemTypes={poemTypes}
              poemTags={poemTags}
            />
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
              <CreatePoemFromScratchForm
                form={form}
                onSubmit={onSubmit}
                poemTypes={poemTypes}
                poemTags={poemTags}
              />
            </CardContent>
          </ShadowCard>
        </div>
      </Form>
    </>
  )
}
