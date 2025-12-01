import Image from "next/image";
import { Metadata } from "next";
import AuthCTAs from "../components/AuthCTAs";
import { generateMetadata as genMeta } from "../lib/seo";

export const metadata: Metadata = genMeta({
  title: "Home — Forms Dashboard",
  description:
    "Build, edit and manage your forms with role-based access, real-time validation, and an intuitive interface. Sign in to get started.",
  path: "/",
});

export default function Landing() {
  return (
    <div>
      <main className="mx-auto max-w-4xl px-6 py-16 text-center">
        <Image
          src="/globe.svg"
          alt="globe"
          width={120}
          height={120}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Forms Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Build, edit and manage your forms — lightweight, fast, and accessible.
          Sign in to get started.
        </p>

        <AuthCTAs />
      </main>
    </div>
  );
}
