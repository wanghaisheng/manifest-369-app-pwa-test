import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ClientBody from "./ClientBody";
// Remove these imports as they're not needed in the server component
// import { useEffect } from 'react';
// import { initDatabase } from '@/lib/database';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "369 显化",
  description: "使用369法则练习吸引力法则，改变思维，改变生活。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Remove the useEffect hook from here
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          <ClientBody>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">{children}</main>
              <Navigation />
            </div>
          </ClientBody>
        </AuthProvider>
      </body>
    </html>
  );
}
