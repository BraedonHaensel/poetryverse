import { poemIds } from './poem.js'
import { tagIds } from './tag.js'

export const poemTagData = [
  { poemId: poemIds.superAdminPoem1, tagId: tagIds.happy },
  { poemId: poemIds.superAdminPoem1, tagId: tagIds.random },

  { poemId: poemIds.superAdminPoem2, tagId: tagIds.life },
  { poemId: poemIds.superAdminPoem2, tagId: tagIds.night },

  { poemId: poemIds.superAdminPoem3, tagId: tagIds.animals },
  { poemId: poemIds.superAdminPoem3, tagId: tagIds.funny },

  { poemId: poemIds.superAdminPoem4, tagId: tagIds.life },
  { poemId: poemIds.superAdminPoem4, tagId: tagIds.night },
  { poemId: poemIds.superAdminPoem4, tagId: tagIds.sad },

  { poemId: poemIds.regularAdminPoem1, tagId: tagIds.animals },

  { poemId: poemIds.regularAdminPoem2, tagId: tagIds.romance },
  { poemId: poemIds.regularAdminPoem2, tagId: tagIds.summer },

  { poemId: poemIds.user1Poem1, tagId: tagIds.funny },
  { poemId: poemIds.user1Poem1, tagId: tagIds.life },

  { poemId: poemIds.user1Poem2, tagId: tagIds.dark },
  { poemId: poemIds.user1Poem2, tagId: tagIds.death },

  { poemId: poemIds.user1Poem3, tagId: tagIds.dreams },
  { poemId: poemIds.user1Poem3, tagId: tagIds.forests },

  { poemId: poemIds.user1Poem4, tagId: tagIds.summer },
  { poemId: poemIds.user1Poem4, tagId: tagIds.technology },
  { poemId: poemIds.user1Poem4, tagId: tagIds.work },

  { poemId: poemIds.user2Poem2, tagId: tagIds.camping },
  { poemId: poemIds.user2Poem2, tagId: tagIds.nature },
  { poemId: poemIds.user2Poem2, tagId: tagIds.winter },
]
