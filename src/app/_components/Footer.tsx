// app/_components/Footer.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// --- İKONLAR ---
const IconFacebook = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> );
const IconX = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> );
const IconInstagram = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> );


export function Footer() {
  const pathname = usePathname();

  // Admin panelindeysek footer'ı gösterme
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-16 md:grid-cols-4">
          
          {/* Sütun 1: Marka/Logo */}
          <div className="md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-white">RENTORA RENT A CAR</h2>
            <p className="text-sm">
              Türkiye'nin dört bir yanında, yolculuklarınızda size eşlik eden güvenilir çözüm ortağınız.
            </p>
          </div>

          {/* Sütun 2: Hakkımızda Linkleri */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wider text-white">Hakkımızda</h3>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
              <li><Link href="/kosullar" className="hover:text-white">Kiralama Koşulları</Link></li>
              <li><Link href="/sss" className="hover:text-white">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/iletisim" className="hover:text-white">Bize Ulaşın</Link></li>
            </ul>
          </div>

          {/* Sütun 3: Sosyal Medya ve İletişim */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wider text-white">Sosyal Medya</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-white"><IconFacebook /></a>
              <a href="#" aria-label="X" className="hover:text-white"><IconX /></a>
              <a href="#" aria-label="Instagram" className="hover:text-white"><IconInstagram /></a>
            </div>
          </div>
          
          {/* Sütun 4: Rezervasyon Hattı */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wider text-white">Rezervasyon Hattı</h3>
            <a href="tel:+905551234567" className="text-xl font-semibold hover:text-white">+90 555 123 45 67</a>
          </div>

        </div>
      </footer>
      
      {/* En Alt Siyah Bant */}
      <div className="bg-black py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} Rentacar. Tüm Hakları Saklıdır.
        </div>
      </div>
    </>
  );
}