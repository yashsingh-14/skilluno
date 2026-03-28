import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillUNO — Learn. Teach. Exchange.",
  description: "A premium token-based skill exchange platform. Master new skills, share your expertise, and grow together in the SkillUNO community.",
  keywords: ["skill exchange", "learn", "teach", "tokens", "marketplace", "peer to peer", "education"],
  authors: [{ name: "SkillUNO" }],
  openGraph: {
    title: "SkillUNO — Learn. Teach. Exchange.",
    description: "A premium token-based skill exchange platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
