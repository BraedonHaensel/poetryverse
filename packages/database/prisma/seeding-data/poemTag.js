import { poemIds } from './poem.js'
import { tagIds } from './tag.js'

export const poemTagData = [
  { poemId: poemIds.id1, tagId: tagIds.random },
  { poemId: poemIds.id1, tagId: tagIds.happy },

  { poemId: poemIds.id2, tagId: tagIds.animals },

  { poemId: poemIds.id3, tagId: tagIds.funny },
  { poemId: poemIds.id3, tagId: tagIds.life },

  { poemId: poemIds.id4, tagId: tagIds.animals },
  { poemId: poemIds.id4, tagId: tagIds.funny },
]
