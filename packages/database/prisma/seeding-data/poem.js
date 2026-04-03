import { poemContents } from './poem-contents.js'
import { normalizePoemBody } from './normalize-poem-body.js'
import { poemTypeIds } from './poemType.js'
import { userIds } from './user.js'

/** Normalizes poem text. */
export const normalizePoemBody = (text) =>
  text
    .toLowerCase()
    .replace(/\s+/g, ' ') // Replace whitespace characters
    .replace(/[^a-z0-9\s]/g, '') // Replace special characters
    .trim()

export const poemIds = {
  superAdminPoem1: 'cmnauvhd1000b356uw16pnt8t',
  superAdminPoem2: 'cmnauvf8t0009356u8okjd59t',
  superAdminPoem3: 'cmnauvd5y0007356uo71h9zsh',
  superAdminPoem4: 'cmnauvacx0005356urnlyfgyq',

  regularAdminPoem1: 'cmnauv7gi0003356u3a3aqj1j',
  regularAdminPoem2: 'cmnauv1fr0001356ux9tnxh69',

  user1Poem1: 'cmn5hpdln000204kzfbg941te',
  user1Poem2: 'cmnauycv2000d356u2oq6xzt9',
  user1Poem3: 'cmnauyjpu000f356u4z98otdu',
  user1Poem4: 'cmnav82ie000h356ul90ubaze',

  user2Poem2: 'cmn5hq2m4000604kzj8mn2b5p',
}

const rawPoemData = [
  {
    id: poemIds.superAdminPoem1,
    authorId: userIds.superAdmin,
    title: 'I Like Cars',
    typeId: poemTypeIds.haiku,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.26,
    body: 'Cars go slow and fast.\nCars drive on highways all day.\nI really like cars.',
    createdAt: new Date('2026-03-15T03:09:16.151Z'),
    updatedAt: new Date('2026-03-15T03:09:16.151Z'),
  },
  {
    id: poemIds.superAdminPoem2,
    authorId: userIds.superAdmin,
    title: 'Moonlight Reflection',
    typeId: poemTypeIds.couplet,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.31,
    body: 'Soft moonlight shines upon the sleeping earth.\nIn its gentle glow, lost souls find their worth.',
    createdAt: new Date('2026-03-16T08:45:22.151Z'),
    updatedAt: new Date('2026-03-16T08:45:22.151Z'),
  },
  {
    id: poemIds.superAdminPoem3,
    authorId: userIds.superAdmin,
    title: 'The Pink Octopus',
    typeId: poemTypeIds.tercet,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.75,
    body: 'The octopus is pink and sweet.\nShe has many fishes to eat.\nCrabs are her favourite treat.',
    createdAt: new Date('2026-03-17T05:11:13.151Z'),
    updatedAt: new Date('2026-03-17T05:11:13.151Z'),
  },
  {
    id: poemIds.superAdminPoem4,
    authorId: userIds.superAdmin,
    title: 'Doppelganger',
    typeId: poemTypeIds.palindrome,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.12,
    body: poemContents.doppelganger,
    createdAt: new Date('2026-03-18T05:11:13.151Z'),
    updatedAt: new Date('2026-03-18T05:11:13.151Z'),
  },
  {
    id: poemIds.regularAdminPoem1,
    authorId: userIds.regularAdmin,
    title: 'Dogs and Cats',
    typeId: poemTypeIds.couplet,
    isPublic: false,
    isAIAssisted: true,
    aiLikelihoodScore: 0.95,
    body: 'Dogs bark, cats meow, WOOF!',
    createdAt: new Date('2026-03-15T03:12:13.151Z'),
    updatedAt: new Date('2026-03-15T03:12:13.151Z'),
  },
  {
    id: poemIds.regularAdminPoem2,
    authorId: userIds.regularAdmin,
    title: "Shall I compare thee to a summer's day?",
    typeId: poemTypeIds.sonnet,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.08,
    body: poemContents.summersDay,
    createdAt: new Date('2026-03-16T03:12:13.151Z'),
    updatedAt: new Date('2026-03-16T03:12:13.151Z'),
  },
  {
    id: poemIds.user1Poem1,
    authorId: userIds.user1,
    title: 'Running On Grass',
    typeId: poemTypeIds.haiku,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.16,
    body: "I like running fast.\nEspecially while on grass.\nUnless it's wet grass.",
    createdAt: new Date('2026-03-19T05:12:13.151Z'),
    updatedAt: new Date('2026-03-19T05:12:13.151Z'),
  },
  {
    id: poemIds.user1Poem2,
    authorId: userIds.user1,
    title: 'The Shadowed Wit',
    typeId: poemTypeIds.ballad,
    isPublic: true,
    isAIAssisted: true,
    aiLikelihoodScore: 0.85,
    body: poemContents.theShadowedWit,
    createdAt: new Date('2026-03-20T05:12:13.151Z'),
    updatedAt: new Date('2026-03-20T05:12:13.151Z'),
  },
  {
    id: poemIds.user1Poem3,
    authorId: userIds.user1,
    title: 'The Forest Dreamer',
    typeId: poemTypeIds.limerick,
    isPublic: true,
    isAIAssisted: true,
    aiLikelihoodScore: 0.79,
    body: poemContents.theForestDreamer,
    createdAt: new Date('2026-03-21T05:12:13.151Z'),
    updatedAt: new Date('2026-03-21T05:12:13.151Z'),
  },
  {
    id: poemIds.user1Poem4,
    authorId: userIds.user1,
    title: 'Digital Summer Drudge',
    typeId: poemTypeIds.quatrain,
    isPublic: true,
    isAIAssisted: true,
    aiLikelihoodScore: 0.91,
    body: poemContents.digitalSummerDrudge,
    createdAt: new Date('2026-03-22T05:12:13.151Z'),
    updatedAt: new Date('2026-03-22T05:12:13.151Z'),
  },
  {
    id: poemIds.user2Poem2,
    authorId: userIds.user2,
    title: 'Winter Snow',
    typeId: poemTypeIds.haiku,
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.22,
    // Source: https://www.facebook.com/groups/2446080102259824/posts/2493742574160243/
    body: 'Snowflakes fall gently.\nBlanketing the frozen ground.\nNature sleeps in white.',
    createdAt: new Date('2026-03-10T14:20:45.151Z'),
    updatedAt: new Date('2026-03-10T14:20:45.151Z'),
  },
]

export const poemData = rawPoemData.map((poem) => ({
  ...poem,
  normalizedBody: normalizePoemBody(poem.body),
}))
