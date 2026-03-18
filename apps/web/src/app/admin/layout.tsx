import AdminNavbar from '@/components/admin-navbar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="bg-off-white flex flex-1 px-6 py-10">
        <div className="m-auto w-full max-w-6xl">{children}</div>
      </main>
    </div>
  )
}