import { poemIds } from './seeding-data/poem.js'
import { tagIds } from './seeding-data/tag.js'

export const poemTagData = [
  { poemId: poemIds.id1, tagId: tagIds.random },
  { poemId: poemIds.id1, tagId: tagIds.happy },

  { poemId: poemIds.id2, tagId: tagIds.animals },

  { poemId: poemIds.id3, tagId: tagIds.funny },
  { poemId: poemIds.id3, tagId: tagIds.life },
]
