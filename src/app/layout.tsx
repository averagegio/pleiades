import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pleiades — People Watching",
  description: "The people watching app",
  icons: {
    icon: [
      { url: "/pleiades-icon.png", type: "image/png" },
    ],
    apple: [{ url: "/pleiades-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Pleiades — People Watching",
    description: "The people watching app",
    images: [{ url: "/pleiades-logo.png", width: 1600, height: 1900 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
