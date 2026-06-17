import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI CV Maker - 95% ATS Score Generator",
  description: "Free AI-powered CV optimization. Get 95%+ ATS score instantly with custom optimization for any job description.",
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
