// app/_components/FloatingActionButtons.tsx

"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

// --- İKONLAR ---
const IconWhatsApp = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg> );
const IconMail = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> );
const IconMapPin = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> );
const IconPhone = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> );
const IconMessageCircle = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg> );

export function FloatingActionButtons() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Admin panelindeysek bu bileşeni gösterme
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  const actions = [
    { label: 'Telefon', href: 'tel:+90 544 479 85 94', icon: <IconPhone />, bgColor: 'bg-blue-500' },
    { label: 'Harita', href: 'https://maps.app.goo.gl/A18621wYCBRuP6Yi7?g_st=iwb', icon: <IconMapPin />, bgColor: 'bg-red-500' },
    { label: 'E-posta', href: 'mailto:rentorarentacar@gmail.com ', icon: <IconMail />, bgColor: 'bg-gray-500' },
    { label: 'WhatsApp', href: 'https://wa.me/+90 544 479 85 94', icon: <IconWhatsApp />, bgColor: 'bg-green-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* Diğer baloncuklar (açıkken görünür) */}
        <div className={`flex flex-col items-center gap-3 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
            {actions.map((action) => (
                <a
                    key={action.label}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 ${action.bgColor}`}
                    aria-label={action.label}
                    title={action.label}
                >
                    {action.icon}
                </a>
            ))}
        </div>
        
        {/* Ana Buton */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-black shadow-xl transition-transform hover:scale-110 focus:outline-none"
            aria-label="İletişim seçeneklerini aç/kapa"
        >
            <IconMessageCircle />
        </button>
    </div>
  );
}