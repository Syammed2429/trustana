import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { WebVitals } from "@/components/web-vitals";
import "./globals.css";
import { ClientWrapper } from "@/components/client-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trustana Product Dashboard",
  description:
    "A modern product data platform dashboard for viewing, searching, and filtering product data efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          {children}
          <Toaster />
          <WebVitals />
        </ClientWrapper>
      </body>
    </html>
  );
}
