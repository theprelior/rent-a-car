import { type Metadata } from "next";
import { ContactForm } from "../_components/ContactForm";

export const metadata: Metadata = {
  title: "İletişim | Rentacar",
  description: "Bize ulaşın. Sorularınız, önerileriniz veya iş ortaklıkları için bizimle iletişime geçin.",
};

// --- İkonlar (renkleri sarı temasına uygun hale getirildi) ---
const IconPhone = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> );
const IconMail = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg> );
const IconMapPin = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> );

export default function IletisimPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Bize Ulaşın
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Sorularınız, önerileriniz veya işbirlikleri için her zaman buradayız.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 rounded-xl bg-neutral-900 p-8 border border-yellow-500/20 shadow-lg">
          
          {/* Sol: İletişim Bilgileri */}
          <div className="space-y-8 flex flex-col justify-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">İletişim Bilgilerimiz</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <IconMapPin />
                  <p className="text-lg text-gray-300">Belediye Evleri Mahallesi 84248 Sokak Feyz Apt No:8 Çukurova/ADANA</p>
                </div>
                <div className="flex items-start space-x-4">
                  <IconPhone />
                  <a href="tel:+905551234567" className="text-lg text-gray-300 transition hover:text-yellow-400">
                    +90 544 479 85 94
                  </a>
                </div>
                <div className="flex items-start space-x-4">
                  <IconMail />
                  <a href="mailto:rentorarentacar@gmail.com" className="text-lg text-gray-300 transition hover:text-yellow-400">
                    rentorarentacar@gmail.com
                  </a>
                </div>
              </div>
            </div>
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