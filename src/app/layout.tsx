import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import { site } from "@/content/site";
import { wedding } from "@/content/wedding";
import "./globals.css";

/**
 * Tipografía editorial ganadora (polish 2026):
 * Bodoni Moda (display) + Manrope (soporte).
 * Ver docs/TYPOGRAPHY.md — comparación vs DM Serif+Inter y Playfair+Source Sans.
 */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
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
      className={`${manrope.variable} ${bodoni.variable} h-full bg-canvas antialiased`}
    >
      <body className="min-h-full bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
