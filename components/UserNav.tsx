"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import useClientStore from "../lib/clientStore";

export default function UserNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const clearAuth = useClientStore((s) => s.clearAuth);
  const addToast = useClientStore((s) => s.addToast);

  const role = (session?.user as any)?.role;

  async function logout() {
    clearAuth();
    await signOut({ redirect: false });
    addToast("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      {role ? (
        <>
          <Link
            href="/forms"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-2 py-1"
          >
            Forms
          </Link>
          {role === "Admin" && (
            <Link
              href="/dashboard"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-2 py-1"
            >
              Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="rounded bg-blue-600 px-3 py-1 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="rounded bg-blue-600 px-3 py-1 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          Login
        </Link>
      )}
    </div>
  );
}
