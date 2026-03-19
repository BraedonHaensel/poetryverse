import AdminNavbar from '@/components/admin-navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="bg-off-white flex flex-1">{children}</main>
    </div>
  )
}
