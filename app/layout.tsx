import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI CV Maker - Free ATS-Optimized Resume Generator",
  description: "Transform your CV with AI. Get ATS-optimized resumes tailored to job descriptions with 75%+ ATS score in seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geist.className} bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
