export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-off-white min-h-screen px-8 py-10">{children}</main>
  )
}
