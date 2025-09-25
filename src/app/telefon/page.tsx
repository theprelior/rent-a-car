// HATA DÜZELTMESİ: Next.js'e özgü importlar kaldırıldı.
// import Link from 'next/link';
// import { type Metadata } from 'next';

// Sayfa için SEO başlığı ve açıklaması
// export const metadata: Metadata = {
//   title: 'Bize Ulaşın - Telefon',
//   description: 'Telefon numaramız üzerinden bizimle doğrudan iletişime geçin.',
// };

export default function TelefonPage() {
  const phoneNumber = "+90 544 479 85 94";
  const telLink = "tel:+905444798594"; // Arama için boşluksuz format

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center">
        <p className="mb-4 text-lg text-gray-400">Bize Ulaşmak İçin</p>
        
        {/* Tıklanabilir büyük telefon numarası */}
        <a 
          href={telLink} 
          className="text-5xl font-bold tracking-wider text-yellow-400 transition-colors hover:text-yellow-300 md:text-7xl lg:text-8xl"
        >
          {phoneNumber}
        </a>
        
        <p className="mt-6 text-base text-gray-500">Numaraya dokunarak veya tıklayarak hemen arayabilirsiniz.</p>
      </div>

      {/* Ana Sayfaya Dön butonu */}
      {/* HATA DÜZELTMESİ: next/link yerine standart <a> etiketi kullanıldı. */}
      <a 
        href="/" 
        className="absolute bottom-10 rounded-full border border-neutral-700 bg-neutral-800/50 px-6 py-3 text-sm text-gray-300 transition-colors hover:bg-neutral-700"
      >
        Ana Sayfaya Dön
      </a>
    </main>
  );
}

