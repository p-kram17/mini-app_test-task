"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AuthCTAs() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  return (
    <div className="flex justify-center gap-4">
      {!session && (
        <Link
          href="/login"
          className="inline-flex items-center rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Get started
        </Link>
      )}
      {session && role === "Admin" && (
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      )}
      {session && role !== "Admin" && (
        <Link
          href="/forms"
          className="inline-flex items-center rounded border px-5 py-3 text-gray-700 hover:bg-gray-100"
        >
          Browse forms
        </Link>
      )}
    </div>
  );
}
