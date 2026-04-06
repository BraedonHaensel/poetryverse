'use client'

type AdminTab = 'analytics' | 'general' | 'admin'

export default function AdminMobileSidebar({
  activeTab,
  setActiveTab,
  isSuperAdmin,
}: {
  activeTab: AdminTab
  setActiveTab: (tab: AdminTab) => void
  isSuperAdmin: boolean
}) {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-20 border-t border-black/20 bg-white md:hidden">
      <div className={`grid ${isSuperAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <MobileTabItem
          label="ANALYTICS"
          active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        />
        <MobileTabItem
          label="USER MANAGEMENT"
          active={activeTab === 'general'}
          onClick={() => setActiveTab('general')}
        />
        {isSuperAdmin && (
          <MobileTabItem
            label="ADMIN"
            active={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
          />
        )}
      </div>
    </nav>
  )
}

function MobileTabItem({
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
      className="flex justify-center py-5 text-center text-[11px] font-extrabold tracking-[0.04em]"
    >
      <span className="relative">
        {label}
        {active && (
          <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded bg-black/40" />
        )}
      </span>
    </button>
  )
}
