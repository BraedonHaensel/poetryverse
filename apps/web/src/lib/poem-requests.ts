import { api, displayApiError } from './api'

export type PoemType = {
  id: string
  name: string
}

export type PoemTag = {
  id: string
  name: string
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
