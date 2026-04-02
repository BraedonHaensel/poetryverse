import { ReasonType, ReportStatus, ResolutionType } from '@prisma/client'
import { poemIds } from './poem.js'
import { userIds } from './user.js'

export const reportData = [
  {
    reporterUserId: userIds.user1,
    poemId: poemIds.superAdminPoem1,
    reasonType: ReasonType.AI,
    reason: 'This is clearly an AI generated poem',
  },
  {
    reporterUserId: userIds.regularAdmin,
    poemId: poemIds.superAdminPoem1,
    reasonType: ReasonType.AI,
    reason: 'I have seen this poem in an AI generated slop meme before',
  },
  {
    reporterUserId: userIds.user1,
    poemId: poemIds.regularAdminPoem1,
    reasonType: ReasonType.PLAGIARISM,
    reason: 'This is an Ocean Vuong poem',
  },
  {
    reporterUserId: userIds.user1,
    poemId: poemIds.user1Poem1,
    resolvedByUserId: userIds.superAdmin,
    reasonType: ReasonType.CUSTOM,
    reason: "I don't like this poem",
    resolution: ResolutionType.KEEP,
    status: ReportStatus.RESOLVED,
    adminNote: 'This is not a valid reason to report the poem.',
    createdAt: new Date('2026-03-24 16:24:50.655'),
    resolvedAt: new Date('2026-03-25 11:20:50.655'),
  },
]
