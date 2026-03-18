'use client'

import { useState } from 'react'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, Column } from '@/components/admin-table/data-table'
import { Trash2, Check } from 'lucide-react'
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
]

const columns: Column<ReportedPoem>[] = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'reportType', label: 'Report Type' },

  {
    key: 'poem',
    label: 'Poem',
    render: (row) => (
      <div className="min-w-0 line-clamp-2">
        {row.poem}
      </div>
    ),
  },

  {
    key: 'reason',
    label: 'Reason',
    render: (row) => (
      <div className="min-w-0 line-clamp-2">
        {row.reason}
      </div>
    ),
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('analytics')
  
  return (
    <ShadowCard className="p-0 overflow-hidden">
      <div className="flex">
        <div className="w-72 p-4 border-r border-black/10">
          <div className="flex flex-col gap-2">
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
        </div>

        <div className="flex-1 p-6">
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'general' && <div>General User Management</div>}
          {activeTab === 'admin' && <div>Admin User Management</div>}
        </div>
      </div>
    </ShadowCard>
  )
}

function SidebarItem({label, active, onClick,}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-4 py-3 text-left transition ${
        active
          ? 'bg-off-white text-black font-medium'
          : 'text-black hover:bg-off-white'
      }`}
    >
      {label}
    </button>
  )
}

function AnalyticsView() {
  return (
    <div className="flex flex-col gap-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Statistics
        </CardTitle>
      </CardHeader>

      <ShadowCard className='bg-off-white'>
        {/* Hardcoded values matching figma designs */}
        <CardContent className="flex gap-6">
          <StatCard title="Number of Poems" value="50" />
          <StatCard title="Number of AI Poems" value="23" />
          <StatCard title="Number of Handwritten Poems" value="27" />
        </CardContent>
      </ShadowCard>

      <ShadowCard>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Reported Poems
          </CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable
            columns={columns}
            data={reportedPoems}
            renderActions={(row) => (
              <>
                <Trash2 size={18} className="cursor-pointer" />
                <Check size={18} className="cursor-pointer" />
              </>
            )}
    />
        </CardContent>
      </ShadowCard>
    </div>
  )
}

function StatCard({title, value,}: {
  title: string
  value: string
}) {
  return (
    <div className="flex-1 rounded-xl bg-white p-6 text-center shadow-md">
      <div className="mb-2 text-sm font-medium text-black">{title}</div>
      <div className="text-5xl font-bold">{value}</div>
    </div>
  )
}