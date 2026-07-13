import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Great Awakening — Claim Map | 3D Interactive Conspiracy Graph",
  description:
    "An interactive 3D, Arkham-intelligence-style node graph of every claim, entity, and concept on the Great Awakening Map poster — 284 nodes across 14 categories, describing what each conspiracy alleges.",
  keywords: [
    "Great Awakening Map",
    "conspiracy theory",
    "QAnon",
    "Secret Space Program",
    "UFO",
    "extraterrestrial",
    "interactive graph",
    "3D graph",
  ],
  authors: [{ name: "Great Awakening Claim Map" }],
  openGraph: {
    title: "Great Awakening — Claim Map",
    description:
      "3D interactive graph of every claim on the Great Awakening Map poster. 284 nodes, 1,381 connections.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Great Awakening — Claim Map",
    description:
      "3D interactive graph of every claim on the Great Awakening Map poster.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: "#06070d", color: "#e7e6f0" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
