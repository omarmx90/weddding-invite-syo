import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
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
  title: wedding.meta.title,
  description: wedding.meta.description,
  openGraph: {
    title: wedding.meta.title,
    description: wedding.meta.description,
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: wedding.meta.title,
    description: wedding.meta.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FCFAF7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={wedding.locale}
      className={`${sourceSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas font-sans text-ink">{children}</body>
    </html>
  );
}
