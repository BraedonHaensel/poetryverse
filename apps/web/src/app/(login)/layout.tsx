export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex h-svh min-w-[320px] flex-col">{children}</main>
}
