import { api, displayApiError } from './api'

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export type UserData = {
  id: string
  name: string
  email: string
  username: string

  image: string
  role: UserRole

  emailVerified: Date | null

  createdAt: Date
  updatedAt: Date
}

/**
 * Gets a user's data.
 * @returns The user's data.
 */
export async function getUserData(): Promise<UserData | undefined> {
  return api
    .get('/api/users/me')
    .then((response) => {
      const data = response.data.data
      console.log('User data:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get user data')
      return undefined
    })
}

/**
 * Checks if a user role is for an admin user (regular or super admin).
 * @param userRole The role of the user to check.
 * @returns True if the user is an admin (regular or super), otherwise false.
 */
export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN
}
