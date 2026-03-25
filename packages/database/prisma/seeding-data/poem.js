const poemId = {
  id1: 'cmn5hpjpr000304kzeqt67a4g',
  id2: 'cmn5hp5i8000104kz2sqhbrlb',
  id3: 'cmn5hpdln000204kzfbg941te',
}

export const poemData = [
  {
    id: poemId.id1,
    authorId: 'cmn2apa7m0000wbrmgb2s775x',
    title: 'A Poem About Cars',
    typeId: 'haiku',
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.26,
    body: 'cars go fast, cars go slow',
    createdAt: new Date('2026-03-25T03:09:16.151Z'),
    updatedAt: new Date('2026-03-25T03:09:16.151Z'),
  },
  {
    id: poemId.id2,
    authorId: 'cmn5grryw0000m68o3m0jttjo',
    title: 'Dogs and Cats',
    typeId: 'couplet',
    isPublic: false,
    isAIAssisted: true,
    aiLikelihoodScore: 0.95,
    body: 'dogs bark, cats meow WOOF',
    createdAt: new Date('2026-03-25T03:12:13.151Z'),
    updatedAt: new Date('2026-03-25T03:09:16.151Z'),
  },
  {
    id: poemId.id3,
    authorId: 'cmn5gss8a0002m68oamdbn850',
    title: 'Running On Grass',
    typeId: 'sonnet',
    isPublic: true,
    isAIAssisted: false,
    aiLikelihoodScore: 0.16,
    body: 'running on grass makes me feel slow, but running on cement... WOW',
    createdAt: new Date('2026-03-26T05:16:13.151Z'),
    updatedAt: new Date('2026-03-26T03:12:13.151Z'),
  },
]
