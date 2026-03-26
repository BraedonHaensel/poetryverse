import { Request, Response } from 'express'

import { prisma } from '../lib/db'

export const getPoemTags = async (_req: Request, res: Response) => {
  const tags = await prisma.tag.findMany()

  return res.status(200).json({ data: tags })
}
