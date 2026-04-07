'use client'

import { useState } from 'react'

import AdminUserManagement from '@/app/admin/admin-user/page-contents'
import AnalyticsPageContents from '@/app/admin/analytics/page-contents'
import GeneralUserManagement from '@/app/admin/general-user/page-contents'
import AdminMobileSidebar from '@/components/admin-mobile-sidebar'
import AdminSidebar from '@/components/admin-sidebar'
import { useAdminUser } from '@/context/admin-user-context'

type AdminTab = 'analytics' | 'general' | 'admin'
type UserManagementView = 'general' | 'admin'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics')
  const [mobileUserView, setMobileUserView] =
    useState<UserManagementView>('general')
  const { role } = useAdminUser()

  const isSuperAdmin = role === 'SUPER_ADMIN'
  const isMobileUserManagementTab =
    activeTab === 'general' || activeTab === 'admin'

  return (
    <div className="flex min-h-0 w-full flex-1">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSuperAdmin={isSuperAdmin}
      />

      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobile */}
        <main className="flex-1 overflow-y-auto pb-24 md:hidden">
          {activeTab === 'analytics' && <AnalyticsPageContents />}

          {isMobileUserManagementTab && (
            <>
              <div className="px-5 pt-3">
                <div className="flex items-center justify-between text-lg text-black">
                  <button
                    onClick={() => setMobileUserView('general')}
                    className="relative pb-1"
                  >
                    <span
                      className={
                        mobileUserView === 'general'
                          ? 'text-black'
                          : 'text-black/60'
                      }
                    >
                      General User
                    </span>
                    {mobileUserView === 'general' && (
                      <span className="absolute right-0 bottom-0 left-0 h-[1.5px] bg-black/40" />
                    )}
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => setMobileUserView('admin')}
                      className="relative pb-1"
                    >
                      <span
                        className={
                          mobileUserView === 'admin'
                            ? 'text-black'
                            : 'text-black/60'
                        }
                      >
                        Admin
                      </span>
                      {mobileUserView === 'admin' && (
                        <span className="absolute right-0 bottom-0 left-0 h-[1.5px] bg-black/40" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {mobileUserView === 'general' && <GeneralUserManagement />}
              {mobileUserView === 'admin' && isSuperAdmin && (
                <AdminUserManagement />
              )}
            </>
          )}
        </main>

        {/* Desktop */}
        <main className="hidden flex-1 overflow-y-auto p-10 md:block">
          {activeTab === 'analytics' && <AnalyticsPageContents />}
          {activeTab === 'general' && <GeneralUserManagement />}
          {activeTab === 'admin' && isSuperAdmin && <AdminUserManagement />}
        </main>

        {/* Mobile bottom nav */}
        <AdminMobileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  )
}
