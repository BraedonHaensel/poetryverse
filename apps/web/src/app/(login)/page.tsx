import Image from 'next/image'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { getAuthSession } from '@/lib/nextauth'

import { GoogleLoginButton } from './google-login-button'
import { GuestLoginButton } from './guest-login-button'

export default async function Login() {
  // Redirect to the Home page if the user is already signed in
  const session = await getAuthSession()
  if (session?.user) {
    return redirect('/home')
  }

  return (
    <div className="flex flex-col items-center">
      <Image
        src="/feather-logo.svg"
        alt="PoetryVerse logo"
        width={50}
        height={50}
      />
      <h1 className="text-center text-2xl">Welcome to PoetryVerse</h1>
      <p className="text-center">
        Sign in with your Google account or browse poetry as a guest.
      </p>
      <GoogleLoginButton className="w-full" />
      <div className="my-2 flex w-full items-center gap-4">
        <Separator className="flex-1 bg-black" />
        <span>or</span>
        <Separator className="flex-1 bg-black" />
      </div>
      <GuestLoginButton className="w-full" />
      <div>TODO carousel</div>
    </div>
  )
}
