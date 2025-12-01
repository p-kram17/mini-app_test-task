import type { Metadata } from "next";

// Base SEO configuration
export const siteConfig = {
  name: "Forms Dashboard",
  description:
    "Manage and organize your forms with role-based access, real-time validation, and intuitive UI.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://forms-dashboard.app",
  ogImage: "/og-image.jpg",
  twitter: {
    creator: "@yourusername",
    site: "@yoursite",
  },
};

// Generate complete metadata for a page
export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
  path = "",
}: {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  path?: string;
}): Metadata {
  const desc = description || siteConfig.description;
  const ogImage = image || siteConfig.ogImage;
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description: desc,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      title,
      description: desc,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImage],
      creator: siteConfig.twitter.creator,
      site: siteConfig.twitter.site,
    },
    alternates: {
      canonical: url,
    },
  };
}

// Root layout metadata (used as template/fallback)
export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "forms",
    "dashboard",
    "management",
    "role-based access",
    "validation",
    "Next.js",
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter.creator,
    site: siteConfig.twitter.site,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
