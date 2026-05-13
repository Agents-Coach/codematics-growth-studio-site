import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/chat/ChatWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Codematics Growth Studio | AI Workforce for Business Growth",
    template: "%s | Codematics",
  },
  description:
    "We design and deploy custom AI agent workforces around your specific operations — research, offers, copy, funnels, email, SEO, sales, launches, and automation working together as a coordinated team.",
  keywords: [
    "AI workforce",
    "AI agents",
    "business automation",
    "growth agency",
    "AI marketing",
    "agentic AI",
    "AI operations",
    "growth studio",
    "marketing automation",
    "AI sales",
    "AI content",
  ],
  authors: [{ name: "Codematics" }],
  creator: "Codematics",
  metadataBase: new URL("https://codematics.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codematics.ai",
    siteName: "Codematics Growth Studio",
    title: "Codematics Growth Studio | AI Workforce for Business Growth",
    description:
      "We design and deploy custom AI agent workforces around your specific operations — research, offers, copy, funnels, email, SEO, sales, launches, and automation working together as a coordinated team.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codematics Growth Studio",
    description:
      "Deploy a custom AI growth team inside your business.",
    creator: "@codematics",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 antialiased selection:bg-cyan-500/30">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
