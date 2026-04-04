'use client'

import { CircleCheckBig, Trash2 } from 'lucide-react'

import { Column, DataTable } from '@/components/admin-table/data-table'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ReportedPoem = {
  id: number
  title: string
  reportType: string
  poem: string
  reason: string
}

const reportedPoems: ReportedPoem[] = [
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
  return (
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
              renderActions={(_row) => (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="cursor-pointer transition hover:opacity-70"
                    aria-label="Delete report"
                  >
                    <Trash2 size={28} strokeWidth={2.25} />
                  </button>

                  <button
                    type="button"
                    className="cursor-pointer transition hover:opacity-70"
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
