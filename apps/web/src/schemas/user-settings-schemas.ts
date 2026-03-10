import * as z from 'zod'

// Validation limits
const USERNAME_MIN = 5
const USERNAME_MAX = 32

/**
 * Schema for validating username changes.
 */
export const UsernameSchema = z.object({
  username: z
    .string()
    .min(USERNAME_MIN, `Username must be at least ${USERNAME_MIN} characters.`)
    .max(USERNAME_MAX, `Username must be at most ${USERNAME_MAX} characters.`),
})

// Type inferred from UsernameSchema
export type UsernameSchema = z.infer<typeof UsernameSchema>
