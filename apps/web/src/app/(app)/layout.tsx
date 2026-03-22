import DesktopNavbar from '@/components/desktop-navbar'
import MobileNavbar from '@/components/mobile-navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-w-[320px] flex-col">
      <DesktopNavbar className="hidden h-16 md:block" />
      <main className="bg-off-white flex flex-1 flex-col overflow-auto">
        {children}
      </main>
      <MobileNavbar className="h-20 md:hidden" />
    </div>
  )
}
