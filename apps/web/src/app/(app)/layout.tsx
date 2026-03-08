import DesktopNavbar from '@/components/desktop-navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DesktopNavbar />
      <main className="bg-off-white flex flex-1 px-6 py-10">
        <div className="m-auto w-full max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
