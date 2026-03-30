import { z } from 'zod'

/** Validates `GET /api/users/:id` route params. */
export const getUserSchema = z.object({
  params: z.object({
    id: z.cuid('User ID must be a valid CUID.'),
  }),
})

/** Validates `GET /api/users/following/:id` route params. */
export const getUserFollowingSchema = getUserSchema

/** Validates `GET /api/users/followers/:id` route params. */
export const getUserFollowersSchema = getUserSchema

/** Validates `PUT /api/users/me/following/:id` route params. */
export const followUserSchema = getUserSchema

/** Validates `DELETE /api/users/me/following/:id` route params. */
export const unfollowUserSchema = getUserSchema

/** Route params type for `getUserSchema`. */
export type getUserRequest = z.infer<typeof getUserSchema>['params']

/** Route params type for `getUserFollowingSchema`. */
export type getUserFollowingRequest = z.infer<
  typeof getUserFollowingSchema
>['params']

/** Route params type for `getUserFollowersSchema`. */
export type getUserFollowersRequest = z.infer<
  typeof getUserFollowersSchema
>['params']

/** Route params type for `followUserSchema */
export type followUserRequest = z.infer<typeof followUserSchema>['params']

/** Route params type for `unfollowUserSchema */
export type unfollowUserRequest = z.infer<typeof unfollowUserSchema>['params']
