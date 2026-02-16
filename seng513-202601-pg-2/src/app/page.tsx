// Note: I havce created this Front End Log In for testing Purposes


import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import Image from "next/image";
import SignOutButton from "@/components/AuthButtons/SignOutButton";

export default async function Home() {
  const session = await getAuthSession();
  return (

    // Note: This is created for Next Auth Testing Purposes
    <div>
      {session?.user ? (
          <div className='flex items-center justify-between gap-2 '>
              <h1>{session?.user.name}</h1>
              <SignOutButton text = {"SignOut"}/>
          </div>
      ):(
          <div>
              <h1>No User Logged In</h1>
              <Link href={"/signIn"}>Click here to Log in</Link>
          </div>
      )
      }

    </div>
  );
}
