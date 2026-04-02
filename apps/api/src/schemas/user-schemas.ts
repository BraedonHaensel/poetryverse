import { RoleEnum } from '@prisma/client'
import { z } from 'zod'

// Validation limits
const USERNAME_MIN = 5
const USERNAME_MAX = 32

/** Validates `GET /api/users/:id` route params. */
export const getUserSchema = z.object({
  params: z.object({
    id: z.cuid('User ID must be a valid CUID.'),
  }),
})

/** Validates `PATCH /api/users/me` request body. */
export const updateUserInfoSchema = z.object({
  body: z
    .object({
      username: z
        .string()
        .min(
          USERNAME_MIN,
          `Username must be at least ${USERNAME_MIN} characters.`
        )
        .max(
          USERNAME_MAX,
          `Username must be at most ${USERNAME_MAX} characters.`
        )
        .optional(),
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Request body must include at least one updatable field.',
    }),
})

export const updateUserRoleRequestSchema = z.object({
  params: z.object({
    id: z.cuid('User ID must be a valid CUID.'),
  }),
  body: z.object({
    role: z.enum(RoleEnum),
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

/** Request body type for `updateUserInfoSchema`. */
export type updateUserInfoRequest = z.infer<typeof updateUserInfoSchema>['body']
