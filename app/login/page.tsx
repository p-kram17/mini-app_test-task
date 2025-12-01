"use client";

import { useState } from "react";
import useClientStore from "../../lib/clientStore";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Individual");
  const [loading, setLoading] = useState(false);
  const setAuth = useClientStore((s) => s.setAuth);
  const addToast = useClientStore((s) => s.addToast);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const finalRole = role === "Admin" ? "Admin" : "Individual";

      // Use NextAuth signIn
      const result = await signIn("credentials", {
        email,
        role: finalRole,
        redirect: false,
      });

      if (result?.error) {
        addToast("Login failed");
        return;
      }

      // Update client store for immediate UI updates
      setAuth(email, finalRole);
      addToast("Logged in successfully");

      // Redirect based on role
      if (finalRole === "Admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch (error) {
      addToast("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex items-center justify-center py-16">
      <form
        onSubmit={onSubmit}
        className="p-6 bg-white rounded shadow w-full max-w-md"
      >
        <h1 className="text-2xl mb-4">Login</h1>
        <label htmlFor="email" className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-required="true"
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none"
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <label htmlFor="role" className="block mb-4">
          <span className="text-sm">Role</span>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none"
          >
            <option>Individual</option>
            <option>Admin</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
