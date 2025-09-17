// app/iletisim/page.tsx

import { type Metadata } from "next";
import { ContactForm } from "../_components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim | Rentacar",
  description: "Bize ulaşın. Sorularınız, önerileriniz veya iş ortaklıkları için bizimle iletişime geçin.",
};

const IconPhone = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> );
const IconMail = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> );
const IconMapPin = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> );

export default function IletisimPage() {
  return (
    <div className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Bize Ulaşın</h1>
          <p className="mt-4 text-lg text-gray-300">Sorularınız, önerileriniz veya işbirlikleri için her zaman buradayız.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 rounded-lg bg-gray-900 p-8">
          {/* Sol: İletişim Bilgileri */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">İletişim Bilgilerimiz</h2>
              <div className="flex items-center space-x-4 mb-4">
                <IconMapPin />
                <p className="text-gray-300">İskenderun, Hatay, Türkiye</p>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <IconPhone />
                <a href="tel:+905551234567" className="text-gray-300 hover:text-white">+90 555 123 45 67</a>
              </div>
              <div className="flex items-center space-x-4">
                <IconMail />
                <a href="mailto:info@rentacar.com" className="text-gray-300 hover:text-white">info@rentacar.com</a>
              </div>
            </div>
            {/* Buraya gelecekte bir harita eklenebilir */}
          </div>

          {/* Sağ: İletişim Formu */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}