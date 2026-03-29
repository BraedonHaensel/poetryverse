import { userIds } from './user.js'

export const followData = [
  { followerId: userIds.superAdmin, followingId: userIds.regularAdmin },
  { followerId: userIds.superAdmin, followingId: userIds.user1 },

  { followerId: userIds.regularAdmin, followingId: userIds.superAdmin },
  { followerId: userIds.regularAdmin, followingId: userIds.user2 },

  { followerId: userIds.user1, followingId: userIds.regularAdmin },
  { followerId: userIds.user1, followingId: userIds.user2 },

  { followerId: userIds.user2, followingId: userIds.user1 },
]
