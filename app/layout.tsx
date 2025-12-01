import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastProvider from "../components/ToastProvider";
import UserNav from "../components/UserNav";
import Link from "next/link";
import { rootMetadata } from "../lib/seo";
import AuthProvider from "../components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = rootMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="border-b bg-white">
            <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
              <Link href="/" className="font-semibold">
                Forms Dashboard
              </Link>
              <UserNav />
            </nav>
          </header>

          <main className="mx-auto max-w-6xl p-6">{children}</main>

          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
