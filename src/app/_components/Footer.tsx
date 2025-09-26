"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin } from "lucide-react"; // lucide-react ikonlarını kullanıyoruz

export function Footer() {
  const pathname = usePathname();

  // Admin panelindeysek footer'ı gösterme
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <footer className="bg-neutral-900 text-gray-300 border-t-2 border-yellow-500/20">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-16 md:grid-cols-4">
          
            {/* Sütun 1: Marka */}
          <div className="md:col-span-1">
            {/* DEĞİŞİKLİK: Logo yerine Navbar'daki metin stili kullanıldı */}
            <Link href="/" className="mb-4 inline-block text-2xl font-extrabold tracking-wider bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              RENTORA
            </Link>
            <p className="text-sm text-gray-400">
              Türkiye'nin dört bir yanında, yolculuklarınızda size eşlik eden güvenilir çözüm ortağınız.
            </p>
          </div>


          {/* Sütun 2: Hızlı Bağlantılar */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wider text-white">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li><Link href="/hakkimizda" className="transition hover:text-yellow-400">Hakkımızda</Link></li>
              <li><Link href="/kosullar" className="transition hover:text-yellow-400">Kiralama Koşulları</Link></li>
              <li><Link href="/fiyat-listesi" className="transition hover:text-yellow-400">Fiyat Listesi</Link></li>
              <li><Link href="/sss" className="transition hover:text-yellow-400">S.S.S.</Link></li>
            </ul>
          </div>

          {/* Sütun 3: İletişim */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wider text-white">İletişim</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <MapPin size={20} className="text-yellow-500 flex-shrink-0" />
                 <span className="text-gray-400">Belediye Evleri Mahallesi 84248 Sokak Feyz Apt No:8 Çukurova/ADANA</span>
               </div>
               <a href="tel:+905444798594" className="flex items-center gap-3 transition hover:text-yellow-400">
                 <Phone size={20} className="text-yellow-500" />
                 <span className="text-gray-400 hover:text-white">+90 544 479 85 94</span>
               </a>
               <a href="mailto:info@rentora.com" className="flex items-center gap-3 transition hover:text-yellow-400">
                 <Mail size={20} className="text-yellow-500" />
                 <span className="text-gray-400 hover:text-white">rentorarentacar@gmail.com</span>
               </a>
            </div>
          </div>
          
          {/* Sütun 4: Bize Ulaşın Butonu */}
          <div className="flex items-start md:items-center md:justify-end">
             <Link href="/iletisim" className="rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 font-semibold text-black shadow-lg transition-transform hover:scale-105">
                Bize Ulaşın
             </Link>
          </div>
        </div>
      </footer>
      
      {/* En Alt Siyah Bant */}
      <div className="bg-black py-4 text-center text-sm text-gray-500">
        <div className="container mx-auto px-4">
          © {new Date().getFullYear()} RENTORA. Tüm Hakları Saklıdır.
        </div>
      </div>
    </>
  );
}