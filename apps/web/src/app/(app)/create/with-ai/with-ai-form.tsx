import { UseFormReturn } from 'react-hook-form'

import { LargeButton } from '@/components/large-button'
import { cn } from '@/lib/utils'
import { CreateWithAISchema } from '@/schemas/create-poem-schemas'

import { PoemContentsField } from '../fields/poem-contents-field'
import { PoemPromptField } from '../fields/poem-prompt-field'
import { PoemTagsField } from '../fields/poem-tags-field'
import { PoemTitleField } from '../fields/poem-title-field'
import { PoemTypeField } from '../fields/poem-type-field'
import { PoemVisibilityField } from '../fields/poem-visibility-field'

type Props = {
  form: UseFormReturn<CreateWithAISchema>
  onSubmit: (data: CreateWithAISchema) => void
  isGenerated: boolean
  onGenerateClick: () => void
}

/**
 * Create poem with AI form.
 */
export default function CreatePoemWithAIForm({
  form,
  onSubmit,
  isGenerated,
  onGenerateClick,
}: Props) {
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
