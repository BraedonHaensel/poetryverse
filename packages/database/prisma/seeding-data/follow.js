import { userIds } from './user.js'

export const followData = [
  { followerId: userIds.user1, followingId: userIds.user2 },
  { followerId: userIds.user1, followingId: userIds.user3 },
  { followerId: userIds.user2, followingId: userIds.user1 },
  { followerId: userIds.user3, followingId: userIds.user2 },
]
