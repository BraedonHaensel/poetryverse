import { redirect } from 'next/navigation'
import { getAuthSession } from '@/lib/nextauth'
import SignInButton from '@/components/AuthButtons/SigninButton'

const Page = async () => {
  const session = await getAuthSession()

  // This logic is responsible for checking if user has set a username on initial login.
  if (session?.user) {
    if (session?.user?.username) {
      redirect('/')
    } else {
      redirect('/setUsername')
    }
  }

  return (
    // This is a test code for the sign in page. Change to front end interface we want.
    <div className="mt-2 flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-xl font-bold">Welcome to NextAuth</h1>

      <SignInButton text="Sign in With Google Provider" />
    </div>
  )
}

export default Page
