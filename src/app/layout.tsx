import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { NextAuthProvider } from "./_components/NextAuthProvider";
import { Navbar } from "./_components/Navbar";
import { TRPCReactProvider } from "~/trpc/react";
import { Footer } from "./_components/Footer"; // <-- 1. Footer'ı import et
import { FloatingActionButtons } from "./_components/FloatingActionButtons"; // <-- 1. Import et

export const metadata: Metadata = {
  title: "Araba Kiralama Projesi",
  description: "Tolunay Akkoyun tarafından geliştirildi.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html> etiketine suppressHydrationWarning ekliyoruz
    <html lang="tr" className={`${geist.variable}`} suppressHydrationWarning>
      <body className="pt-16"> 
        <TRPCReactProvider>
          <NextAuthProvider>
            <Navbar />
            {children}
            <Footer /> 
            <FloatingActionButtons /> {/* <-- 2. Footer'ın yanına ekle */}

          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
