import { api, displayApiError } from './api'

export const ReportResolutionType = {
  KEEP: 'KEEP',
  UPDATE_AI_TAG: 'UPDATE_AI_TAG',
  REMOVE: 'REMOVE',
} as const

export type ReportResolutionType =
  (typeof ReportResolutionType)[keyof typeof ReportResolutionType]

export type ReportStatus = 'OPEN' | 'RESOLVED'

export type ReportData = {
  id: number
  poemId: string
  reasonType: string
  reason: string
  status: ReportStatus
  createdAt: string | Date
  adminNote?: string | null
  resolution?: string | null
  poem: {
    title: string
    body: string
  }
}

/**
 * Gets all open reports.
 * @returns List of open report objects.
 */
export async function getReports(): Promise<ReportData[] | undefined> {
  return api
    .get('/api/reports')
    .then((response) => {
      const data = response.data.data
      console.log('Reports:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get reports')
      return undefined
    })
}

/**
 * Gets a specific report by ID.
 * @param reportId ID of the report to retrieve.
 * @returns The report object if found.
 */
export async function getReportById(
  reportId: number
): Promise<ReportData | undefined> {
  return api
    .get(`/api/reports/${reportId}`)
    .then((response) => {
      const data = response.data.data
      console.log('Report:', data)
      return data
    })
    .catch((error) => {
      displayApiError(error, 'Failed to get report')
      return undefined
    })
}

/**
 * Resolves a report.
 * @param reportId ID of the report to resolve.
 * @param resolutionType Type of resolution to apply.
 * @param adminNote Optional admin note explaining the resolution.
 * @returns True if the report was successfully resolved, otherwise false.
 */
export async function resolveReport(
  reportId: number,
  resolutionType: ReportResolutionType,
  adminNote?: string
): Promise<boolean> {
  return api
    .patch(`/api/reports/${reportId}`, {
      resolutionType,
      ...(adminNote ? { adminNote } : {}),
    })
    .then((response) => {
      console.log('Resolved report:', response.status)
      return true
    })
    .catch((error) => {
      displayApiError(error, 'Failed to resolve report')
      return false
    })
}
