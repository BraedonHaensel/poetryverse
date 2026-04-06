import { PoemTagsSelector } from '@/components/poem-tags-selector'
import type { PoemTag } from '@/lib/poem-requests'

interface PoemTagsFilterProps {
  poemTags: PoemTag[]
  selectedTagIds: string[]
  onChange: (tagIds: string[]) => void
}

export function PoemTagsFilter({
  poemTags,
  selectedTagIds,
  onChange,
}: PoemTagsFilterProps) {
  return (
    <div>
      <p className="mb-2 font-semibold">Tags</p>
      <PoemTagsSelector
        poemTags={poemTags}
        selectedTagIds={selectedTagIds}
        onChange={onChange}
        isInvalid={false}
      />
    </div>
  )
}
