import AdminNavbar from '@/components/admin-navbar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh min-w-[320px] flex-col">
      <AdminNavbar />
      <main className="flex flex-1 flex-col overflow-auto bg-white">
        {children}
      </main>
    </div>
  )
}
