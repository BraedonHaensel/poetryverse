'use client'

import { CircleCheckBig, Trash2 } from 'lucide-react'
import { useState } from 'react'

import AdminUserManagement from '@/app/admin/admin-user/page'
import GeneralUserManagement from '@/app/admin/general-user/page'
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

  // use row later for deletion
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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('analytics')

  return (
    <div className="flex min-h-[calc(100vh-72px)] w-full bg-white">
      <aside className="w-69.5 border-r border-black/10">
        <div className="flex flex-col pt-0">
          <SidebarItem
            label="Analytics"
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
          />
          <SidebarItem
            label="General User Management"
            active={activeTab === 'general'}
            onClick={() => setActiveTab('general')}
          />
          <SidebarItem
            label="Admin User Management"
            active={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
          />
        </div>
      </aside>

      <main className="flex-1 px-9 py-10">
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'general' && <GeneralUserManagement />}
        {activeTab === 'admin' && <AdminUserManagement />}
      </main>
    </div>
  )
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full border-b border-black/10 px-7 py-6 text-left text-[18px] font-semibold transition',
        active
          ? 'bg-admin-sidebar-active text-black'
          : 'hover:bg-admin-hover bg-white text-black',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function AnalyticsView() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <CardHeader className="px-0 pt-0 pb-5">
          <CardTitle className="text-2xl font-bold text-black">
            Statistics
          </CardTitle>
        </CardHeader>

        <ShadowCard className="bg-admin-panel rounded-4xl px-10 py-12">
          <CardContent className="grid grid-cols-1 gap-8 p-0 md:grid-cols-3">
            <StatCard title="Number of Poems" value="50" />
            <StatCard title="Number of AI Poems" value="23" />
            <StatCard title="Number of Handwritten Poems" value="27" />
          </CardContent>
        </ShadowCard>
      </section>

      <section>
        <CardHeader className="px-0 pt-0 pb-5">
          <CardTitle className="text-2xl font-bold text-black">
            Reported Poems
          </CardTitle>
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
                    className="cursor-pointer text-black transition hover:opacity-70"
                    aria-label="Delete report"
                  >
                    <Trash2 size={28} strokeWidth={2.25} />
                  </button>

                  <button
                    type="button"
                    className="cursor-pointer text-black transition hover:opacity-70"
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
    <div className="flex min-h-[px] flex-col items-center justify-center rounded-4xl bg-white px-6 py-8 text-center shadow-md">
      <div className="mb-5 text-xl font-semibold text-black">{title}</div>
      <div className="text-6xl leading-none font-bold text-black">{value}</div>
    </div>
  )
}
