'use client'

import { CircleCheckBig, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Column, DataTable } from '@/components/admin-table/data-table'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ReportedPoem = {
  id: number
  title: string
  reportType: string
  poem: string
  reason: string
}

const initialReportedPoems: ReportedPoem[] = [
  {
    id: 12,
    title: 'My Haiku',
    reportType: 'AI Usage',
    poem: 'AI writing poetry is made a lot easier when you use AI.',
    reason: 'Clearly written using AI with repeated phrasing.',
  },
  {
    id: 24,
    title: 'When I Was One',
    reportType: 'Inappropriate Content',
    poem: 'No man is an island, entire of itself...',
    reason: 'Contains inappropriate and sensitive content.',
  },
  {
    id: 45,
    title: 'Simple Haiku',
    reportType: 'AI Usage',
    poem: 'This is a haiku demonstrating a sample poem creation.',
    reason:
      'Low effort poem, clearly written by AI. Admins please take this low quality content off of the platform.',
  },
]

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

export default function AnalyticsPageContents() {
  const [reportedPoems, setReportedPoems] = useState(initialReportedPoems)
  const [selectedPoem, setSelectedPoem] = useState<ReportedPoem | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false)

  const handleDelete = (id: number) => {
    setReportedPoems((prevPoems) => prevPoems.filter((poem) => poem.id !== id))
  }

  const handleApprove = (id: number) => {
    console.log('Approve report:', id)
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

    handleDelete(selectedPoem.id)
    handleCloseDeleteDialog()
  }

  const handleApproveConfirm = async () => {
    if (!selectedPoem) return

    handleApprove(selectedPoem.id)
    handleCloseApproveDialog()
  }

  return (
    <>
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        title={
          selectedPoem
            ? `Are you sure you want to delete ${selectedPoem.title}?`
            : 'Are you sure you want to delete this poem?'
        }
        description="This action cannot be undone."
        onClose={handleCloseDeleteDialog}
        onAction={handleDeleteConfirm}
        variant="delete"
      />

      <ConfirmationDialog
        isOpen={isApproveConfirmOpen}
        title={
          selectedPoem
            ? `Are you sure you want to approve ${selectedPoem.title}?`
            : 'Are you sure you want to approve this poem?'
        }
        description="The report will be closed and the poem will remain on PoetryVerse."
        onClose={handleCloseApproveDialog}
        onAction={handleApproveConfirm}
        variant="default"
      />

      {/*Mobile Layout*/}
      <div className="md:hidden">
        <div className="flex flex-col gap-6 p-4">
          <section>
            <h2 className="mb-3 text-xl font-semibold">Statistics</h2>

            <div className="grid grid-cols-2 gap-4">
              <MobileStatCard title="Number of Poems" value="50" />
              <MobileStatCard title="Number of AI Poems" value="23" />
            </div>

            <MobileStatCard
              title="Number of Handwritten Poems"
              value="27"
              className="mt-4"
            />
          </section>

          {/* REPORTED POEMS */}
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
                <StatCard title="Number of Poems" value="50" />
                <StatCard title="Number of AI Poems" value="23" />
                <StatCard title="Number of Handwritten Poems" value="27" />
              </CardContent>
            </ShadowCard>
          </section>

          <section>
            <CardHeader className="px-0 pt-0 pb-5">
            <CardTitle className="text-2xl font-bold">Reported Poems</CardTitle>
            </CardHeader>

            <ShadowCard className="bg-admin-panel rounded-4xl p-3">
              <CardContent className="max-h-117.5 overflow-y-auto p-0">
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
              </CardContent>
            </ShadowCard>
          </section>
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
      <p className="text-sm font-medium text-center">{title}</p>
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
  const badgeColor =
    poem.reportType === 'AI Usage' ? 'bg-slate-500' : 'bg-red-800'

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

      <div className="mt-3 flex gap-4">
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
