import { userIds } from './user.js'

export const poemIds = {
  id1: 'cmn5hpjpr000304kzeqt67a4g',
  id2: 'cmn5hp5i8000104kz2sqhbrlb',
  id3: 'cmn5hpdln000204kzfbg941te',
}

export const poemData = [
  {
    id: poemIds.id1,
    authorId: userIds.user1,
    title: 'A Poem About Cars',
    typeId: 'haiku',
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.26,
    body: 'Cars go slow and fast. Cars drive on highways all day. I really like cars.',
    createdAt: new Date('2026-03-25T03:09:16.151Z'),
    updatedAt: new Date('2026-03-25T03:09:16.151Z'),
  },
  {
    id: poemIds.id2,
    authorId: userIds.user2,
    title: 'Dogs and Cats',
    typeId: 'couplet',
    isPublic: false,
    isAIAssisted: true,
    aiLikelihoodScore: 0.95,
    body: 'Dogs bark, cats meow, WOOF!',
    createdAt: new Date('2026-03-24T03:12:13.151Z'),
    updatedAt: new Date('2026-03-24T03:12:13.151Z'),
  },
  {
    id: poemIds.id3,
    authorId: userIds.user3,
    title: 'Running On Grass',
    typeId: 'haiku',
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.16,
    body: "I like running fast. Especially while on grass. Unless it's wet grass.",
    createdAt: new Date('2026-03-23T05:12:13.151Z'),
    updatedAt: new Date('2026-03-23T05:12:13.151Z'),
  },
]
