import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "@/components/AuthButtons/SigninButton";

const Page = async () => {
  const session = await getAuthSession();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-2 mt-2">
     

        <h1 className="text-xl font-bold">
          Welcome to NextAuth
        </h1>

        <SignInButton text="Sign in With Google Provider" />

    </div>
  );
};

export default Page;