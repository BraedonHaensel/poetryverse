import { Request, Response } from 'express'

import { prisma } from '../lib/db'

/**
 * Retrieves all available poem tags.
 * @param _req Incoming Express request (unused).
 * @param res Express response object.
 * @returns A 200 response containing the list of poem tags.
 */
export const getPoemTags = async (_req: Request, res: Response) => {
  const tags = await prisma.tag.findMany()

  return res.status(200).json({ data: tags })
}
