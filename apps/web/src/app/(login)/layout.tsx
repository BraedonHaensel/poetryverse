export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-off-white flex min-h-screen flex-col p-15">
      {children}
    </main>
  )
}
