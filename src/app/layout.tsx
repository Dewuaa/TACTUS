import type { Metadata, Viewport } from "next";
import { League_Spartan, Inter } from "next/font/google";
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "TACTUS — Phygital Experiences",
    template: "%s | TACTUS",
  },
  description:
    "Premium phygital smart keychain platform. Tap to unlock music, AR experiences, and exclusive digital content.",
  keywords: ["TACTUS", "phygital", "NFC", "smart keychain", "AR", "Spotify"],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#101010",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${inter.variable} h-dvh`}
    >
      <body className="min-h-dvh overflow-x-hidden bg-tactus-black text-tactus-white antialiased">
        {children}
      </body>
    </html>
  );
}
