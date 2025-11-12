
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from 'next/font/google';
import { ConditionalChatbot } from "@/components/landing/ConditionalChatbot";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: "Spruce Lifeskills | RTMNU & NEP 2020 Approved Skill Courses",
  description: "Government-Recognized Skill Courses for the Future of India. Empower your career with programs approved by RTMNU and aligned with the National Education Policy 2020.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        <link rel="icon" href="/images/sprucelogo.webp?v=2" type="image/webp" />
      </head>
      <body className="antialiased pb-24 md:pb-0">
        {children}
        <ConditionalChatbot />
        <Toaster />
      </body>
    </html>
  );
}
