import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

// Axios instance for communicating with the backend API
export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
})

interface ApiErrorResponse {
  error: string
}

/**
 * General handler for displaying a notification for an API error.
 * @param error The API error to display.
 * @param prefix The prefix to display before the error.
 * Ex: "Search failed" => "Search failed: Network Error"
 */
export function displayApiError(
  error: AxiosError<ApiErrorResponse>,
  prefix: string
) {
  const toastPrefix = prefix ? prefix + ': ' : ''
  const apiError = error?.response?.data?.error
  if (apiError) {
    console.error(`API error: ${apiError}`)
    toast.error(`${toastPrefix}${apiError}`)
  } else {
    console.error(error)
    toast.error(`${toastPrefix}${error.message}`)
  }
}
