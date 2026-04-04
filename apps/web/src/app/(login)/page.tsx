import Image from 'next/image'
import { redirect } from 'next/navigation'

import { ShadowCard } from '@/components/shadow-card'
import { Separator } from '@/components/ui/separator'
import { getAuthSession } from '@/lib/nextauth'
import { cn } from '@/lib/utils'

import { FeaturesCarousel, FeaturesList } from './components/feature-highlights'
import GoogleSignInButton from './components/google-sign-in-button'
import GuestLoginButton from './components/guest-login-button'
import UsernameForm from './components/username-form'

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
    <>
      {/* Mobile layout */}
      <div
        className={cn(
          'flex w-full flex-col items-center gap-8 px-10 py-15 md:hidden',
          isSettingUsername ? 'my-auto' : 'flex-1'
        )}
      >
        <div className="flex w-full flex-1 flex-col items-center justify-end gap-8">
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={80}
            height={80}
          />
          <h1 className="text-center text-4xl">Welcome to PoetryVerse</h1>
          {isSettingUsername ? (
            <p className="mt-4 pb-4 text-center text-3xl">
              Create Your Username
            </p>
          ) : (
            <p className="text-center text-xl">
              Sign in with your Google account or browse poetry as a guest.
            </p>
          )}

          {!isSettingUsername && (
            // Login buttons
            <div className="flex w-full flex-col">
              <GoogleSignInButton className="w-full" />
              <div className="my-2 flex w-full items-center gap-4">
                <Separator className="flex-1 bg-black" />
                <span>or</span>
                <Separator className="flex-1 bg-black" />
              </div>
              <GuestLoginButton className="w-full" />
            </div>
          )}
        </div>

        {isSettingUsername ? (
          <UsernameForm className="w-full" />
        ) : (
          <FeaturesCarousel />
        )}
      </div>

      {/* Desktop layout */}
      <div className="bg-off-white mx-auto hidden w-full flex-1 gap-8 p-15 md:grid md:grid-cols-2 xl:gap-20 xl:px-30">
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

          <div className="relative hidden flex-1 min-[935px]:block">
            <Image
              className="object-contain"
              src="/poem-writing-hand.svg"
              alt="Hand writing poem"
              loading="eager"
              fill
            />
          </div>
        </div>

        {/* Right column on desktop */}
        <ShadowCard className="my-auto flex w-full flex-col items-center justify-end gap-8 px-10 py-10 min-[870px]:py-20">
          <Image
            src="/feather-logo.svg"
            alt="PoetryVerse logo"
            width={60}
            height={60}
          />
          {isSettingUsername ? (
            <>
              <h2 className="text-center text-3xl">Create a Username</h2>
              <UsernameForm />
            </>
          ) : (
            <>
              <h2 className="text-center text-3xl">Log into PoetryVerse</h2>
              <p className="text-center">
                Sign in with your Google account or browse poetry as a guest.
              </p>

              {/* Login buttons */}
              <div className="flex w-full flex-col">
                <GoogleSignInButton className="w-full" />
                <div className="my-2 flex w-full items-center gap-4">
                  <Separator className="flex-1 bg-black" />
                  <span>or</span>
                  <Separator className="flex-1 bg-black" />
                </div>
                <GuestLoginButton className="w-full" />
              </div>
            </>
          )}
        </ShadowCard>
      </div>
    </>
  )
}
