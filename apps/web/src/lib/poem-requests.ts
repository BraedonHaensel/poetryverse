import { PoemFilterMode } from '@/components/poem-filters'

import { api, displayApiError } from './api'

export type PoemData = {
  id: string
  authorId: string
  author: {
    username: string
  }
  title: string
  body: string
  type: PoemType
  poemTags: PoemTag[]

  isPublic: boolean
  isAIAssisted: boolean

  aiLikelihoonScore: number
  count: {
    likes: number
  }

  createdAt: Date
  updatedAt: Date
}

export type PoemType = {
  id: string
  name: string
}

export type PoemTag = {
  id: string
  name: string
}

/**
 * Gets the list of poems for a user.
 * @param userId ID of the user to query.
 * @returns The user's data.
 */
export async function getUserPoems(userId: string): Promise<PoemData[]> {
  return api
    .get('/api/poems', { params: { authorId: userId } })
    .then((response) => {
      const data = response.data
      console.log('Poems:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get poems')
      return []
    })
}

/**
 * Gets the feed poems (all public poems).
 * @returns List of poems for the feed.
 */
export async function getFeedPoems(): Promise<PoemData[]> {
  return api
    .get('/api/poems/feed')
    .then((response) => {
      const data = response.data
      console.log('Feed poems:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get feed poems')
      return []
    })
}

/**
 * Filters a list of poems based on a filter mode.
 * @param poems List of poems to filter.
 * @param filterMode Mode to filter the poems by.
 * @returns Filtered list of poems.
 */
export function filterPoems(
  poems: PoemData[],
  filterMode: PoemFilterMode
): PoemData[] {
  if (filterMode === 'ALL') return poems

  // Filter the poems based on the filter mode
  return poems.filter((poem) => {
    switch (filterMode) {
      case 'PUBLIC':
        return poem.isPublic
      case 'PRIVATE':
        return !poem.isPublic
      case 'AI_ASSISTED':
        return poem.isAIAssisted
      case 'HANDWRITTEN':
        return !poem.isAIAssisted
    }
  })
}

/**
 * Gets the list of poem types.
 * @returns List of poem types.
 */
export async function getPoemTypes(): Promise<PoemType[]> {
  return api
    .get('/api/poem-types')
    .then((response) => {
      const data = response.data.data
      console.log('Poem types:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get poem types')
      return []
    })
}

/**
 * Gets the list of poem tags.
 * @returns List of poem tags.
 */
export async function getPoemTags(): Promise<PoemTag[]> {
  return api
    .get('/api/poem-tags')
    .then((response) => {
      const data = response.data.data
      console.log('Poem tags:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get poem tags')
      return []
    })
}
