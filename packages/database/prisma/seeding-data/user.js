import { RoleEnum } from '@prisma/client'

export const userIds = {
  user1: 'cmn2apa7m0000wbrmgb2s775x',
  user2: 'cmn5grryw0000m68o3m0jttjo',
  user3: 'cmn5gss8a0002m68oamdbn850',
  user4: 'cmn5gss8a0002m68ogmdht670',
}

export const userData = [
  {
    id: userIds.user1,
    name: 'poetperson',
    email: 'poetry19@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocJWhhnVMNPsmcPrun2smvaQqqyGby-OsZlBFXQA_lqhSBy_Zg=s96-c',
    username: 'poetryperson456',
    role: RoleEnum.SUPER_ADMIN,
  },
  {
    id: userIds.user2,
    name: 'JohnDoe',
    email: 'johndow@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocJmj5fJySqfIkcNZwinUwEKlbmBmIz1sCIPgQX8OhMzF91fWw=s96-c',
    username: 'johndoe123',
    role: RoleEnum.ADMIN,
  },
  {
    id: userIds.user3,
    name: 'poetryman',
    email: 'poetryman@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocIbRiKXH6j9ql_MAcuogBdPHAvTm08JA6eZAqb6YhNhElA4Xg=s96-c',
    username: 'poetryman123',
    role: RoleEnum.USER,
  },
  {
    id: userIds.user4,
    name: 'JaneDoe',
    email: 'janedoe@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocJW7X4MmU8DnSQEiceCoue-Zm8xMcQBC16ntr7HFmHBHv4r7spC=s400-c',
    username: 'janedoe321',
    role: RoleEnum.USER,
  },
]
