import Image from 'next/image'
import { redirect } from 'next/navigation'

import { ShadowCard } from '@/components/shadow-card'
import { Separator } from '@/components/ui/separator'
import { getAuthSession } from '@/lib/nextauth'

import { FeaturesCarousel, FeaturesList } from './components/feature-highlights'
import GoogleLoginButton from './components/google-login-button'
import GuestLoginButton from './components/guest-login-button'
import UsernameForm from './components/usrname-form'

export default async function Login() {
  // Redirect to the Home page if the user is already signed in
  const session = await getAuthSession()
  if (session?.user) {
    if (session?.user?.username) {
      redirect('/home')
    }
  }
  const isSettingUsername = session?.user !== undefined

  return (
    <div className="flex flex-1 flex-col gap-8">
      {/* Mobile layout */}
      <div className="mt-5 flex w-full flex-1 flex-col items-center gap-4 md:hidden">
        <div className="flex w-full flex-1 flex-col items-center justify-end gap-8">
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={80}
            height={80}
          />
          <h1 className="text-center text-5xl">Welcome to PoetryVerse</h1>
          {isSettingUsername ? (
            <p className="mt-4 pb-4 text-center text-3xl">
              Create Your Username
            </p>
          ) : (
            <p className="text-center text-2xl">
              Sign in with your Google account or browse poetry as a guest.
            </p>
          )}

          {!isSettingUsername && (
            // Login buttons
            <div className="flex w-full flex-col">
              <GoogleLoginButton className="w-full" />
              <div className="my-2 flex w-full items-center gap-4">
                <Separator className="flex-1 bg-black" />
                <span>or</span>
                <Separator className="flex-1 bg-black" />
              </div>
              <GuestLoginButton className="w-full pb-8" />
            </div>
          )}
        </div>

        {isSettingUsername ? (
          <div className="w-full flex-1">
            <UsernameForm />
          </div>
        ) : (
          <FeaturesCarousel className="flex-1" />
        )}
      </div>

      {/* Desktop layout */}
      <div className="mx-auto mt-5 hidden flex-1 gap-8 md:grid md:grid-cols-2 xl:m-20 xl:gap-20">
        {/* Left column on desktop */}
        <div className="flex flex-col justify-between gap-4">
          <div>
            <div className="mb-8 flex gap-6">
              <Image
                src="/feather-logo.svg"
                alt="PoetryVerse logo"
                width={50}
                height={50}
              />
              <h1 className="text-4xl font-bold">PoetryVerse</h1>
            </div>
            <h2 className="mb-4 text-3xl">Welcome to PoetryVerse.</h2>
            <p className="mb-8 text-xl font-light">
              Join an international community of poets and poetry enthusiasts
              where human creativity can flourish in the age of AI.
            </p>
            <FeaturesList />
          </div>

          <div className="relative w-full flex-1">
            <Image
              className="object-contain object-left"
              src="/poem-writing-hand.svg"
              alt="Hand writing poem"
              fill
            />
          </div>
        </div>

        {/* Right column on desktop */}
        <ShadowCard className="my-auto flex w-full flex-1 flex-col items-center justify-end gap-8 px-10 py-20">
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={60}
            height={60}
          />
          <h2 className="text-center text-3xl">Log into PoetryVerse</h2>
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
        </ShadowCard>
      </div>
    </div>
  )
}
