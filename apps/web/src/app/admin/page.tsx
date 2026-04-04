'use client'

import { useState } from 'react'

import AdminUserManagement from '@/app/admin/admin-user/page-contents'
import AnalyticsPageContents from '@/app/admin/analytics/page-contents'
import GeneralUserManagement from '@/app/admin/general-user/page-contents'
<<<<<<< HEAD
import { Column, DataTable } from '@/components/admin-table/data-table'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminUser } from '@/context/admin-user-context'
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
=======
>>>>>>> f735d77 (fix: separate analytics page from admin page)

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('analytics')

  const { role } = useAdminUser()

  return (
    <div className="flex min-h-0 w-fit min-w-full flex-1">
      {/* Sidebar */}
      <aside className="w-69.5 shrink-0 border-r border-black/10">
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
          {role === 'SUPER_ADMIN' && (
            <SidebarItem
              label="Admin User Management"
              active={activeTab === 'admin'}
              onClick={() => setActiveTab('admin')}
            />
          )}
        </div>
      </aside>

      {/* Main contents */}
      <div className="flex-1 overflow-y-auto p-10">
        {activeTab === 'analytics' && <AnalyticsPageContents />}
        {activeTab === 'general' && <GeneralUserManagement />}
        {activeTab === 'admin' && <AdminUserManagement />}
      </div>
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
        'w-full cursor-pointer border-b border-black/10 px-7 py-6 text-left text-[18px] font-semibold transition',
        active ? 'bg-admin-sidebar-active' : 'hover:bg-admin-hover bg-white',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
