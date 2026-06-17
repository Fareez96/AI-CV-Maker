import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI CV Maker - ATS Optimized Resume Builder",
  description:
    "Transform your CV with AI. Get ATS scores, job-specific optimizations, and keyword matching for better interviews.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-background">
      <body
        className={`${geistSans.className} ${geistMono.className} bg-background text-foreground`}
      >
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
