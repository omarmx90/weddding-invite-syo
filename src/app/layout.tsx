import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { site } from "@/content/site";
import { wedding } from "@/content/wedding";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: wedding.meta.title,
    template: `%s | ${site.name}`,
  },
  description: wedding.meta.description,
  applicationName: site.applicationName,
  authors: [{ name: site.creator }],
  creator: site.creator,
  generator: undefined,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: site.url,
    siteName: site.name,
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Silvia & Omar — Nos casamos — 16 · 10 · 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.meta.title,
    description: wedding.meta.description,
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    title: site.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FCFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#FCFAF7" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={wedding.locale}
      className={`${sourceSans.variable} ${cormorant.variable} h-full bg-canvas antialiased`}
    >
      <body className="min-h-full bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
