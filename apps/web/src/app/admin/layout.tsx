import AdminNavbar from '@/components/admin-navbar'
import { AdminUserProvider } from '@/context/admin-user-context'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminUserProvider>
        <AdminNavbar />
        <main className="bg-off-white flex flex-1">{children}</main>
      </AdminUserProvider>
    </div>
  )
}
