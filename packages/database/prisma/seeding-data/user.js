import { RoleEnum } from '@prisma/client'

export const userIds = {
  superAdmin: 'cmnatshmh00000wjxgxd5wobs',
  regularAdmin: 'cmnatz4xe00020wjxn2xujskm',
  user1: 'cmn5gss8a0002m68oamdbn850',
  user2: 'cmn5gss8a0002m68ogmdht670',
}

export const userData = [
  {
    // Sample super admin user
    id: userIds.superAdmin,
    name: 'PoetryVerse Super Admin',
    email: 'poetryverse123@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocK9T_qGGdbBzL5HpDu347YSc8koDOupXIv18FaY1sj0wdeOlQ=s96-c',
    username: 'masterOfPoetry',
    role: RoleEnum.SUPER_ADMIN,
    createdAt: new Date('2026-02-28 20:43:00.131'),
    createdAt: new Date('2026-02-28 20:45:45.284'),
  },
  {
    // Sample regular admin user
    id: userIds.regularAdmin,
    name: 'Adam Benson',
    email: 'poetryverse513@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocJW7X4MmU8DnSQEiceCoue-Zm8xMcQBC16ntr7HFmHBHv4r7spC=s400-c',
    username: 'adamThePoet',
    role: RoleEnum.ADMIN,
  },
  {
    id: userIds.user1,
    name: 'Blake Washington',
    email: 'blakewashington@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocLFlSSYh4dPSUY-ncLHEVPJVLHRZDeSnjU2iSHyfm0MGjDAdA=s96-c',
    username: 'blakeW99',
    role: RoleEnum.USER,
  },
  {
    id: userIds.user2,
    name: 'Alice Monroe',
    email: 'amonroe123@gmail.com',
    emailVerified: null,
    image:
      'https://lh3.googleusercontent.com/a/ACg8ocIbRiKXH6j9ql_MAcuogBdPHAvTm08JA6eZAqb6YhNhElA4Xg=s96-c',
    username: 'aMonroe123',
    role: RoleEnum.USER,
  },
]
