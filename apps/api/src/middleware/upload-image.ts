import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'

import { badRequest } from '../lib/http-errors'

export const PROFILE_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: PROFILE_IMAGE_MAX_SIZE_BYTES,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(badRequest('File must be an image.'))
    }

    return callback(null, true)
  },
})

/**
 * Parses multipart form data for one `image` file and maps upload errors to HTTP 400.
 */
export const uploadProfileImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload.single('image')(req, res, (err) => {
    if (!err) {
      return next()
    }

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          badRequest(
            `Image file too large. Max size is ${Math.floor(PROFILE_IMAGE_MAX_SIZE_BYTES / (1024 * 1024))}MB.`
          )
        )
      }

      return next(badRequest(err.message))
    }

    return next(err)
  })
}
