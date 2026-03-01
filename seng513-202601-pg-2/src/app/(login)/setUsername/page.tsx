"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// The handle submit function implements the backend api logic to add a username upon initial login
export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/username", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    // Change this to the front end we want. The current code can be removed when working frontend is added.
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Choose your username
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-black text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}