"use client";
import "~/styles/globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./_components/NextAuthProvider";
import { Navbar } from "./_components/Navbar";
import { TRPCReactProvider } from "~/trpc/react";
import { Footer } from "./_components/Footer";
import { FloatingActionButtons } from "./_components/FloatingActionButtons";
import { useEffect } from "react";
import { AlertProvider } from "~/context/AlertContext"; // 1. Provider'ı import et
import { AlertModal } from "./_components/AlertModal";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Yüksek kaliteli SVG tekerlek (Yorum satırları kaldırıldı)
function getWheelSvg(angle: number) {
  const tireColor = "#222";
  const rimColor = "#888";
  const highlightColor = "#DDD";
  const hubColor = "#444";
  const logoColor = "#FFD700";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <g transform="rotate(${angle}, 50, 50)">
        <circle cx="50" cy="50" r="48" fill="${tireColor}" />
        <circle cx="50" cy="50" r="42" fill="${rimColor}" stroke="${hubColor}" stroke-width="1"/>
        ${[0, 72, 144, 216, 288].map(startAngle => `
          <path d="M50,50 L60,12 A40,40 0 0,1 40,12 Z" fill="${rimColor}" transform="rotate(${startAngle}, 50, 50)" />
          <path d="M50,50 L58,15 A38,38 0 0,1 42,15 Z" fill="${highlightColor}" transform="rotate(${startAngle}, 50, 50)" />
        `).join('')}
        <circle cx="50" cy="50" r="18" fill="${hubColor}" />
        <circle cx="50" cy="50" r="8" fill="${logoColor}" />
      </g>
    </svg>
  `;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    let angle = 0;
    let animationId: number;

    const draw = () => {
      angle = (angle + 2) % 360; 
      const svg = getWheelSvg(angle);
      link.href = `data:image/svg+xml;base64,${btoa(svg)}`;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <html lang="tr">
      <body>
        <TRPCReactProvider>
          <NextAuthProvider>
          <AlertProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
              <FloatingActionButtons />

              {/* 4. Modal'ı en sona ekle ki her şeyin üzerinde görünsün */}
              <AlertModal />
            </AlertProvider>
          </NextAuthProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

