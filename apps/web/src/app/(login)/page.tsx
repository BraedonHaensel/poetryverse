import Image from 'next/image'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { getAuthSession } from '@/lib/nextauth'

import { FeaturesCarousel, FeaturesList } from './components/feature-highlights'
import GoogleLoginButton from './components/google-login-button'
import GuestLoginButton from './components/guest-login-button'

export default async function Login() {
  // Redirect to the Home page if the user is already signed in
  const session = await getAuthSession()
  if (session?.user) {
    return redirect('/home')
  }

  return (
    <div className="mt-5 grid flex-1 gap-8 md:grid-cols-2">
      {/* Left column on desktop */}
      <div className="hidden flex-col justify-between gap-4 md:flex">
        <div>
          <div className="mb-8 flex gap-4">
            <Image
              src="/feather-logo.svg"
              alt="PoetryVerse logo"
              width={40}
              height={40}
            />
            <h1 className="text-2xl font-bold">PoetryVerse</h1>
          </div>
          <h2 className="mb-4 text-2xl">Welcome to PoetryVerse.</h2>
          <p className="mb-8 font-light">
            Join an international community of poets and poetry enthusiasts
            where human creativity can flourish in the age of AI
          </p>
          <FeaturesList />
        </div>

        <div className="relative h-100 w-full">
          <Image
            className="object-contain object-left"
            src="/poem-writing-hand.svg"
            alt="Hand writing poem"
            fill
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <div className="flex w-full flex-1 flex-col items-center justify-end gap-8 pb-8">
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={60}
            height={60}
          />
          <div className="text-center text-3xl">
            <h1 className="block md:hidden">Welcome to PoetryVerse</h1>
            <h2 className="hidden md:block">Log into PoetryVerse</h2>
          </div>
          <p className="text-center">
            Sign in with your Google account or browse poetry as a guest.
          </p>

          {/* Login buttons */}
          <div className="flex w-full flex-col">
            <GoogleLoginButton className="w-full" />
            <div className="my-2 flex w-full items-center gap-4">
              <Separator className="flex-1 bg-black" />
              <span>or</span>
              <Separator className="flex-1 bg-black" />
            </div>
            <GuestLoginButton className="w-full" />
          </div>
        </div>

        <FeaturesCarousel className="flex-1" />
      </div>
    </div>
  )
}
