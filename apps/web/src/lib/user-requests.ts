import { api, displayApiError } from './api'

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

type UserStats = {
  authoredPoems: number
  followers: number
  following: number
}

/** User data structure. */
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

  _count: UserStats
}

/**
 * Gets a user's data.
 * @param userId ID of the user to query.
 * @returns The user's data.
 */
export async function getUserData(
  userId?: string
): Promise<UserData | undefined> {
  return api
    .get(`/api/users/${userId ? userId : 'me'}`)
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

/** Follower user data structure. */
export type FollowerData = {
  id: string
  image: string
  isFollowingUser: boolean
  username: string
  _count: UserStats
}

/** Following user data structure. */
export type FollowingData = FollowerData

/**
 * Gets a user's followers.
 * @param userId ID of the user to query.
 * @returns The user's followers.
 */
export async function getUserFollowers(
  userId?: string
): Promise<FollowerData[] | undefined> {
  return api
    .get(`/api/users/${userId ? userId : 'me'}/followers`)
    .then((response) => {
      const data = response.data.data
      console.log('Followers:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get followers')
      return undefined
    })
}

/**
 * Gets a user's following users.
 * @param userId ID of the user to query.
 * @returns The user's following users.
 */
export async function getUserFollowing(
  userId?: string
): Promise<FollowingData[] | undefined> {
  return api
    .get(`/api/users/${userId ? userId : 'me'}/following`)
    .then((response) => {
      const data = response.data.data
      console.log('Following users:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get following users')
      return undefined
    })
}
