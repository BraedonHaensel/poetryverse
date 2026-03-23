import { z } from 'zod'

export const getUserSchema = z.object({
  params: z.object({
    id: z.cuid('User ID must be a valid CUID.'),
  }),
})

export type getUserRequest = z.infer<typeof getUserSchema>['params']
