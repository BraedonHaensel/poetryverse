'use client'

import { useState } from 'react'

import AdminUserManagement from '@/app/admin/admin-user/page-contents'
import AnalyticsPageContents from '@/app/admin/analytics/page-contents'
import GeneralUserManagement from '@/app/admin/general-user/page-contents'
import AdminMobileSidebar from '@/components/admin-mobile-sidebar'
import AdminSidebar from '@/components/admin-sidebar'
import { useAdminUser } from '@/context/admin-user-context'

type AdminTab = 'analytics' | 'general' | 'admin'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics')
  const { role } = useAdminUser()

  return (
    <div className="flex min-h-0 w-full flex-1">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSuperAdmin={role === 'SUPER_ADMIN'}
      />

      {/* Main content */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobile */}
        <main className="flex-1 overflow-y-auto pb-24 md:hidden">
          {activeTab === 'analytics' && <AnalyticsPageContents />}
          {activeTab === 'general' && <GeneralUserManagement />}
          {activeTab === 'admin' && role === 'SUPER_ADMIN' && (
            <AdminUserManagement />
          )}
        </main>

        {/* Desktop */}
        <main className="hidden flex-1 overflow-y-auto p-10 md:block">
          {activeTab === 'analytics' && <AnalyticsPageContents />}
          {activeTab === 'general' && <GeneralUserManagement />}
          {activeTab === 'admin' && role === 'SUPER_ADMIN' && (
            <AdminUserManagement />
          )}
        </main>

        {/* Mobile bottom nav */}
        <AdminMobileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSuperAdmin={role === 'SUPER_ADMIN'}
        />
      </div>
    </div>
  )
}
