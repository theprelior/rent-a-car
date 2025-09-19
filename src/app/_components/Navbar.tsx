"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AuthPanel } from "./AuthPanel"; // AuthPanel bileşenini import ediyoruz

// --- İKONLAR ---
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconMenu = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>);
const IconX = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" /></svg>);
const IconLogOut = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>);

const navItems = [
 { name: "Anasayfa", href: "/" }, { name: "Hakkımızda", href: "/hakkimizda" },
 { name: "Fiyat Listesi", href: "/fiyat-listesi" }, { name: "Kiralama Koşulları", href: "/kosullar" },
 { name: "S.S.S.", href: "/sss" }, { name: "İletişim", href: "/iletisim" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Panel durumu için state'ler
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Paneli açacak olan yardımcı fonksiyon
  const openAuthPanel = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthPanelOpen(true);
    setIsMobileMenuOpen(false); // Mobil menüyü de kapatalım
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  // Admin panelinde navbar'ı gösterme
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className={`fixed top-0 z-40 w-full transition-all duration-300 ${isScrolled ? "bg-black/95 shadow-lg backdrop-blur-md" : "bg-black/70"}`}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Marka */}
          <Link href="/" className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            RENTORA
          </Link>

          {/* Masaüstü Navigasyon */}
          <nav className="hidden items-center space-x-2 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-base font-semibold transition-all duration-200 ease-in-out transform ${
                    isActive
                      ? "bg-yellow-600 text-black shadow-md"
                      : "text-gray-300 hover:text-yellow-400 hover:bg-neutral-800 hover:translate-y-[-2px] hover:shadow-lg"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sağ Taraf: Kullanıcı İşlemleri */}
          <div className="flex items-center space-x-4">
            <div className="hidden items-center space-x-4 lg:flex">
              {status === "authenticated" ? (
                // Oturum AÇIKSA
                <>
                  <Link href="/profil" className="flex items-center space-x-2 text-base text-gray-200 hover:text-yellow-400 transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]">
                    <IconUser />
                    <span>{session.user.name ?? session.user.email}</span>
                  </Link>
                  <button onClick={() => void signOut()} className="text-gray-400 hover:text-yellow-500 transition-all duration-200 ease-in-out transform hover:scale-110 hover:translate-y-[-2px]" title="Çıkış Yap">
                    <IconLogOut />
                  </button>
                </>
              ) : (
                // Oturum KAPALIYSA
                <>
                  <button onClick={() => openAuthPanel('login')} className="text-base font-medium text-gray-200 hover:text-yellow-400 transition-all duration-200 ease-in-out transform hover:translate-y-[-2px]">
                    Üye Girişi
                  </button>
                  <button onClick={() => openAuthPanel('register')} className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-5 py-2.5 text-base font-semibold text-black shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 hover:translate-y-[-2px]">
                    Kayıt Ol
                  </button>
                </>
              )}
            </div>
            {/* Mobil Hamburger Butonu */}
            <div className="flex items-center lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menüyü aç/kapa" className="text-gray-200 hover:text-yellow-400 transition">
                {isMobileMenuOpen ? <IconX /> : <IconMenu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobil Menü Paneli */}
      <div className={`fixed top-16 z-30 w-full bg-black/95 transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-[120%]"}`}>
        <nav className="container mx-auto flex flex-col space-y-1 p-4">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="rounded-md px-3 py-3 text-base font-semibold text-gray-300 hover:text-yellow-400 hover:bg-neutral-800">
              {item.name}
            </Link>
          ))}
          <div className="border-t border-neutral-700 pt-4 mt-4">
            {status === "authenticated" ? (
              // Mobil - Oturum AÇIKSA
              <div className="space-y-4">
                <Link href="/profil" className="flex items-center space-x-2 rounded-md px-3 py-3 text-base font-semibold text-gray-300 hover:text-yellow-400 hover:bg-neutral-800">
                  <IconUser />
                  <span>{session.user.name ?? session.user.email}</span>
                </Link>
                <button onClick={() => void signOut()} className="flex w-full items-center space-x-2 rounded-md px-3 py-3 text-base font-semibold text-gray-300 hover:text-yellow-400 hover:bg-neutral-800">
                  <IconLogOut />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            ) : (
              // Mobil - Oturum KAPALIYSA
              <div className="space-y-4">
                <button onClick={() => openAuthPanel('login')} className="flex w-full items-center space-x-2 rounded-md px-3 py-3 text-base font-semibold text-gray-300 hover:text-yellow-400 hover:bg-neutral-800">
                  <IconUser />
                  <span>Üye Girişi</span>
                </button>
                <button onClick={() => openAuthPanel('register')} className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-3 py-3 text-base font-semibold text-black shadow-md hover:scale-105 transition-transform">
                  Kayıt Ol
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Kimlik Doğrulama Paneli (her zaman render edilir ama sadece "isOpen" true olunca görünür) */}
      <AuthPanel 
        isOpen={isAuthPanelOpen} 
        onClose={() => setIsAuthPanelOpen(false)} 
        initialMode={authMode} 
      />
    </>
  );
}