import { api, displayApiError } from './api'
import { UserData, UserRole } from './user-requests'

/**
 * Gets all users, optionally filtered by role.
 * @param role Optional role to filter users by.
 * @returns List of users matching the filter.
 */
export async function getUsers(
  role?: UserRole
): Promise<UserData[] | undefined> {
  return api
    .get('/api/users', {
      params: role ? { role } : {},
    })
    .then((response) => {
      const data = response.data
      console.log('Users:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get users')
      return undefined
    })
}

/**
 * Deletes a user by ID.
 * @param userId ID of the user to delete.
 * @returns True if the user was successfully deleted, otherwise false.
 */
export async function deleteUser(userId: string): Promise<boolean> {
  return api
    .delete(`/api/users/${userId}`)
    .then(() => {
      console.log('Deleted user:', userId)
      return true
    })
    .catch((error) => {
      displayApiError(error, 'Failed to delete user')
      return false
    })
}

/**
 * Updates a user's role.
 * @param userId ID of the user to update.
 * @param role New role to assign to the user.
 * @returns Updated user data if successful.
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<UserData | undefined> {
  return api
    .patch(`/api/users/${userId}/role`, { role })
    .then((response) => {
      const data = response.data.data
      console.log('Updated user role:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to update user role')
      return undefined
    })
}
