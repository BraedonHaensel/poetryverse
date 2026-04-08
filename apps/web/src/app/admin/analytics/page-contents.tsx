'use client'

import { CircleCheckBig, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Column, DataTable } from '@/components/admin-table/data-table'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllPoems } from '@/lib/poem-requests'
import {
  getReports,
  ReportData,
  ReportResolutionType,
  resolveReport,
} from '@/lib/report-requests'

type ReportedPoem = {
  id: number
  title: string
  reportType: string
  poem: string
  reason: string
}

type AnalyticsSnapshot = {
  totalPoems: number
  aiPoems: number
  handwrittenPoems: number
  reportedPoems: ReportedPoem[]
}

const columns: Column<ReportedPoem>[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'reportType', label: 'Report Type' },
  {
    key: 'poem',
    label: 'Poem',
    className: 'justify-start text-left text-sm',
  },
  {
    key: 'reason',
    label: 'Reason',
    className: 'justify-start text-left text-sm',
  },
]

function formatReportType(reasonType: string) {
  return reasonType
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function mapReportToReportedPoem(report: ReportData): ReportedPoem {
  return {
    id: report.id,
    title: report.poem.title,
    reportType: formatReportType(report.reasonType),
    poem: report.poem.body,
    reason: report.reason,
  }
}

async function fetchAnalyticsSnapshot(): Promise<AnalyticsSnapshot> {
  const [allPoems, reports] = await Promise.all([getAllPoems(), getReports()])

  return {
    totalPoems: allPoems.length,
    aiPoems: allPoems.filter((poem) => poem.isAIAssisted).length,
    handwrittenPoems: allPoems.filter((poem) => !poem.isAIAssisted).length,
    reportedPoems: (reports ?? []).map(mapReportToReportedPoem),
  }
}

export default function AnalyticsPageContents() {
  const [reportedPoems, setReportedPoems] = useState<ReportedPoem[]>([])
  const [selectedPoem, setSelectedPoem] = useState<ReportedPoem | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [totalPoems, setTotalPoems] = useState(0)
  const [aiPoems, setAiPoems] = useState(0)
  const [handwrittenPoems, setHandwrittenPoems] = useState(0)

  const didFetch = useRef(false)

  const selectedPoemTitle = useMemo(
    () => selectedPoem?.title ?? 'this poem',
    [selectedPoem]
  )

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true

    async function initializeAnalytics() {
      try {
        const data = await fetchAnalyticsSnapshot()

        setTotalPoems(data.totalPoems)
        setAiPoems(data.aiPoems)
        setHandwrittenPoems(data.handwrittenPoems)
        setReportedPoems(data.reportedPoems)
      } finally {
        setIsLoading(false)
      }
    }

    void initializeAnalytics()
  }, [])

  async function refreshAnalyticsData() {
    const data = await fetchAnalyticsSnapshot()

    setTotalPoems(data.totalPoems)
    setAiPoems(data.aiPoems)
    setHandwrittenPoems(data.handwrittenPoems)
    setReportedPoems(data.reportedPoems)
  }

  const handleOpenDeleteDialog = (poem: ReportedPoem) => {
    setSelectedPoem(poem)
    setIsDeleteConfirmOpen(true)
  }

  const handleOpenApproveDialog = (poem: ReportedPoem) => {
    setSelectedPoem(poem)
    setIsApproveConfirmOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteConfirmOpen(false)
    setSelectedPoem(null)
  }

  const handleCloseApproveDialog = () => {
    setIsApproveConfirmOpen(false)
    setSelectedPoem(null)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPoem) return

    setIsSubmitting(true)

    const success = await resolveReport(
      selectedPoem.id,
      ReportResolutionType.REMOVE
    )

    if (success) {
      toast.success('Poem deleted and report resolved')
      await refreshAnalyticsData()
      handleCloseDeleteDialog()
    }

    setIsSubmitting(false)
  }

  const handleApproveConfirm = async () => {
    if (!selectedPoem) return

    setIsSubmitting(true)

    const success = await resolveReport(
      selectedPoem.id,
      ReportResolutionType.KEEP
    )

    if (success) {
      toast.success('Report approved and closed')
      await refreshAnalyticsData()
      handleCloseApproveDialog()
    }

    setIsSubmitting(false)
  }

  if (isLoading) return <PageLoadingIndicator />

  return (
    <>
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        title={`Are you sure you want to delete ${selectedPoemTitle}?`}
        description="This action cannot be undone."
        onClose={handleCloseDeleteDialog}
        onAction={handleDeleteConfirm}
        variant="delete"
      />

      <ConfirmationDialog
        isOpen={isApproveConfirmOpen}
        title={`Are you sure you want to approve ${selectedPoemTitle}?`}
        description="The report will be closed and the poem will remain on PoetryVerse."
        onClose={handleCloseApproveDialog}
        onAction={handleApproveConfirm}
        variant="default"
      />

      {/*Mobile Layout*/}
      <div className={isSubmitting ? 'pointer-events-none opacity-70' : ''}>
        <div className="md:hidden">
          <div className="flex flex-col gap-6 p-4">
            <section>
              <h2 className="mb-3 text-xl font-semibold">Statistics</h2>

              <div className="grid grid-cols-2 gap-4">
                <MobileStatCard
                  title="Number of Poems"
                  value={String(totalPoems)}
                />
                <MobileStatCard
                  title="Number of AI Poems"
                  value={String(aiPoems)}
                />
              </div>

              <MobileStatCard
                title="Number of Handwritten Poems"
                value={String(handwrittenPoems)}
                className="mt-4"
              />
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">Reported Poems</h2>

              <div className="flex flex-col gap-4">
                {reportedPoems.map((poem) => (
                  <MobilePoemCard
                    key={poem.id}
                    poem={poem}
                    onDelete={() => handleOpenDeleteDialog(poem)}
                    onApprove={() => handleOpenApproveDialog(poem)}
                  />
                ))}

                {reportedPoems.length === 0 && (
                  <ShadowCard className="p-4">
                    <CardContent className="text-center">
                      There are no open reports.
                    </CardContent>
                  </ShadowCard>
                )}
              </div>
            </section>
          </div>
        </div>

        {/*Desktop Layout*/}
        <div className="hidden md:block">
          <div className="flex min-w-225 flex-col gap-10">
            <section>
              <CardHeader className="px-0 pt-0 pb-5">
                <CardTitle className="text-2xl font-bold">Statistics</CardTitle>
              </CardHeader>

              <ShadowCard className="bg-admin-panel rounded-4xl px-10 py-12">
                <CardContent className="grid grid-cols-3 gap-8 p-0">
                  <StatCard
                    title="Number of Poems"
                    value={String(totalPoems)}
                  />
                  <StatCard
                    title="Number of AI Poems"
                    value={String(aiPoems)}
                  />
                  <StatCard
                    title="Number of Handwritten Poems"
                    value={String(handwrittenPoems)}
                  />
                </CardContent>
              </ShadowCard>
            </section>

            <section>
              <CardHeader className="px-0 pt-0 pb-5">
                <CardTitle className="text-2xl font-bold">
                  Reported Poems
                </CardTitle>
              </CardHeader>

              <ShadowCard className="bg-admin-panel rounded-4xl p-3">
                <CardContent className="max-h-117.5 overflow-y-auto p-0">
                  {reportedPoems.length === 0 ? (
                    <div className="p-6 text-center">
                      There are no reported poems.
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={reportedPoems}
                      renderActions={(row) => (
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            className="cursor-pointer transition hover:opacity-70"
                            onClick={() => handleOpenDeleteDialog(row)}
                            aria-label="Delete report"
                          >
                            <Trash2 size={28} strokeWidth={2.25} />
                          </button>

                          <button
                            type="button"
                            className="cursor-pointer transition hover:opacity-70"
                            onClick={() => handleOpenApproveDialog(row)}
                            aria-label="Approve report"
                          >
                            <CircleCheckBig size={30} strokeWidth={2.25} />
                          </button>
                        </div>
                      )}
                    />
                  )}
                </CardContent>
              </ShadowCard>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl bg-white px-6 py-8 text-center shadow-md">
      <div className="mb-5 text-xl font-semibold">{title}</div>
      <div className="text-6xl leading-none font-bold">{value}</div>
    </div>
  )
}

function MobileStatCard({
  title,
  value,
  className = '',
}: {
  title: string
  value: string
  className?: string
}) {
  return (
    <div className={`rounded-xl bg-white p-3 shadow-sm ${className}`}>
      <p className="text-center text-sm font-medium">{title}</p>
      <p className="mt-4 text-center text-3xl font-bold">{value}</p>
    </div>
  )
}

function MobilePoemCard({
  poem,
  onDelete,
  onApprove,
}: {
  poem: ReportedPoem
  onDelete: () => void
  onApprove: () => void
}) {
  const badgeColor = poem.reportType.toLowerCase().includes('ai')
    ? 'bg-slate-500'
    : 'bg-red-800'

  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span>ID: {poem.id}</span>
            <span className="italic">{poem.title}</span>
          </div>

          <span
            className={`mt-1 inline-block rounded px-2 py-0.5 text-xs text-white ${badgeColor}`}
          >
            {poem.reportType}
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm whitespace-pre-line">{poem.poem}</p>

      <div className="mt-3 flex cursor-pointer gap-4 transition hover:opacity-80">
        <button onClick={onDelete}>
          <Trash2 size={22} />
        </button>
        <button onClick={onApprove}>
          <CircleCheckBig size={22} />
        </button>
      </div>
    </div>
  )
}
