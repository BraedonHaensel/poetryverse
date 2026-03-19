export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-off-white flex min-h-screen flex-col px-8 py-10">
      {children}
    </main>
  )
}
