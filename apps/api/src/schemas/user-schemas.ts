import { z } from 'zod'

import { PROFILE_IMAGE_MAX_SIZE_BYTES } from '../middleware/upload-image'

/** Validates `GET /api/users/:id` route params. */
export const getUserSchema = z.object({
  params: z.object({
    id: z.cuid('User ID must be a valid CUID.'),
  }),
})

export const updateProfilePictureSchema = z.object({
  file: z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      size: z.number().int().positive(),
      buffer: z.instanceof(Buffer),
    })
    .refine((file) => file.fieldname === 'image', {
      message: 'Image must be sent with field name "image".',
    })
    .refine((file) => file.mimetype.startsWith('image/'), {
      message: 'File must be an image.',
    })
    .refine((file) => file.size <= PROFILE_IMAGE_MAX_SIZE_BYTES, {
      message: `Image file too large. Max size is ${Math.floor(PROFILE_IMAGE_MAX_SIZE_BYTES / (1024 * 1024))}MB.`,
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
