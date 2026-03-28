import { UseFormReturn } from 'react-hook-form'

import { LargeButton } from '@/components/large-button'
import { PoemTag, PoemType } from '@/lib/poem-requests'
import { CreateFromScratchSchema } from '@/schemas/create-poem-schemas'

import { PoemAIAssistanceField } from '../fields/poem-ai-assistance-field'
import { PoemContentsField } from '../fields/poem-contents-field'
import { PoemTagsField } from '../fields/poem-tags-field'
import { PoemTitleField } from '../fields/poem-title-field'
import { PoemTypeField } from '../fields/poem-type-field'
import { PoemVisibilityField } from '../fields/poem-visibility-field'

type Props = {
  form: UseFormReturn<CreateFromScratchSchema>
  onSubmit: (data: CreateFromScratchSchema) => void
  poemTypes: PoemType[]
  poemTags: PoemTag[]
}

/**
 * Create poem from scratch form.
 */
export default function CreatePoemFromScratchForm({
  form,
  onSubmit,
  poemTypes,
  poemTags,
}: Props) {
  const control = form.control

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-x-5 gap-y-2 md:grid-cols-2"
    >
      {/* Left column fields on desktop */}
      <div className="space-y-2 md:space-y-3">
        <PoemTypeField control={control} poemTypes={poemTypes} />
        <PoemContentsField control={control} />
      </div>

      {/* Right column fields on desktop */}
      <div className="space-y-2 md:space-y-3">
        <PoemTitleField control={control} />
        <PoemTagsField control={control} poemTags={poemTags} />
        <PoemVisibilityField control={control} />
        <PoemAIAssistanceField control={control} />

        {/* Publish button */}
        <LargeButton type="submit">Publish</LargeButton>
      </div>
    </form>
  )
}
