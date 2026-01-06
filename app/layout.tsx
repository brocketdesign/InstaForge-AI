import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import "./globals.css";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "InstaForge AI - Instagram Content Generator",
  description: "Create Instagram-ready visuals and captions from a simple prompt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
