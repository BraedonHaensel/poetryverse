import path from 'path'

import { badRequest } from './http-errors'

/** Helper function for extracting an error status from an error message. */
export const getErrorStatus = (err: unknown): number | undefined => {
  if (typeof err !== 'object' || err === null) {
    return undefined
  }

  const status = (err as { status?: unknown }).status
  return typeof status === 'number' ? status : undefined
}

/** Helper function for getting api upload path. */
export const getUploadDirectoryPath = () =>
  path.resolve(process.cwd(), 'uploads')

/** Helper function for converting multer extension to file extension. */
export const getImageExtension = (mimetype: string) => {
  switch (mimetype) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/gif':
      return 'gif'
    default:
      throw badRequest('Unsupported image type.')
  }
}
