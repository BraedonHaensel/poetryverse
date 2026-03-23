import { z } from 'zod'

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().nonempty('User ID is required.'),
  }),
})

export type getUserRequest = z.infer<typeof getUserSchema>['params']
