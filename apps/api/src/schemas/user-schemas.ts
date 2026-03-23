import { z } from 'zod'

export const getUserSchema = z.object({
  params: z.object({
    id: z.cuid('User ID must be a valid CUID.'),
  }),
})

/** Same schema as getUserSchema */
export const getUserFollowingSchema = getUserSchema

/** Same schema as getUserSchema */
export const getUserFollowersSchema = getUserSchema

export type getUserRequest = z.infer<typeof getUserSchema>['params']
export type getUserFollowingRequest = z.infer<
  typeof getUserFollowingSchema
>['params']
export type getUserFollowersRequest = z.infer<
  typeof getUserFollowersSchema
>['params']
