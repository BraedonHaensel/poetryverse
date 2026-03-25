export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen min-w-[320px] flex-col">{children}</main>
  )
}
