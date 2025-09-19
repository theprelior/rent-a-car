import "~/styles/globals.css";
import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./_components/NextAuthProvider";
import { Navbar } from "./_components/Navbar";
import { TRPCReactProvider } from "~/trpc/react";
import { Footer } from "./_components/Footer";
import { FloatingActionButtons } from "./_components/FloatingActionButtons";
import { headers } from "next/headers"; // <-- 1. headers'ı import et

export const metadata: Metadata = {
  title: "Araba Kiralama Projesi",
  description: "Tolunay Akkoyun tarafından geliştirildi.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <TRPCReactProvider>
          <NextAuthProvider>
            <Navbar />
            {/* main etiketinde artık className yok */}
            <main>
              {children}
            </main>
            <Footer />
            <FloatingActionButtons />
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}