import AdminNavbar from '@/components/admin-navbar'
import { AdminUserProvider } from '@/context/admin-user-context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh min-w-[320px] flex-col">
      <AdminUserProvider>
        <AdminNavbar />
        <main className="bg-off-white flex flex-1 flex-col overflow-auto md:bg-white">
          {children}
        </main>
      </AdminUserProvider>
    </div>
  )
}
