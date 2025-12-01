"use client";

import Link from "next/link";
import useClientStore from "../lib/clientStore";

function getRoleFromCookie() {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )role=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

export default function AuthCTAs() {
  const stateRole = useClientStore((s) => s.role);
  const role = stateRole ?? getRoleFromCookie();

  return (
    <div className="flex justify-center gap-4">
      {!role && (
        <Link
          href="/login"
          className="inline-flex items-center rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          Get started
        </Link>
      )}
      {role && (
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
