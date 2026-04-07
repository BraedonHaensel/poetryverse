'use client'

type AdminTab = 'analytics' | 'general' | 'admin'

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isSuperAdmin,
}: {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  isSuperAdmin: boolean
}) {
  return (
    <aside className="hidden w-69.5 shrink-0 border-r border-black/10 bg-white md:block">
      <div className="flex flex-col">
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
        {isSuperAdmin && (
          <SidebarItem
            label="Admin User Management"
            active={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
          />
        )}
      </div>
    </aside>
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
