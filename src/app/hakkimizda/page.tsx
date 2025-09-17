// app/hakkimizda/page.tsx

import Link from "next/link";
import { type Metadata } from "next";

// Her sayfa için özel Metadata (başlık, açıklama vb.) tanımlayabiliriz.
// Bu SEO için çok önemlidir.
export const metadata: Metadata = {
  title: "Hakkımızda | Rentacar",
  description: "Rentacar olarak misyonumuz, vizyonumuz ve değerlerimiz hakkında daha fazla bilgi edinin.",
};

// İkonlarımızı burada tanımlayalım
const IconShieldCheck = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg> );
const IconHeart = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg> );
const IconAward = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg> );


export default function HakkimizdaPage() {
  return (
    <div className="bg-gray-800 text-white">
      {/* 1. Bölüm: Ana Başlık */}
      <section className="bg-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Yolculuktaki Güvenilir Partneriniz
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300">
            Rentacar olarak, her yolculuğun özel olduğuna inanıyoruz. Misyonumuz, size sadece bir araba değil, aynı zamanda konfor, güvenlik ve unutulmaz anılar sunmaktır.
          </p>
        </div>
      </section>

      {/* 2. Bölüm: Değerlerimiz */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Değerlerimiz</h2>
            <p className="mt-4 text-gray-400">Bizi biz yapan temel ilkelerimiz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 text-blue-400"><IconShieldCheck /></div>
              <h3 className="mb-2 text-xl font-bold">Güvenilirlik</h3>
              <p className="text-gray-400">Tüm araçlarımız düzenli olarak bakımdan geçer ve en yüksek güvenlik standartlarına sahiptir. Size ve sevdiklerinize güvenli bir yolculuk sunmak önceliğimizdir.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 text-blue-400"><IconHeart /></div>
              <h3 className="mb-2 text-xl font-bold">Müşteri Memnuniyeti</h3>
              <p className="text-gray-400">7/24 yanınızdayız. Kiralama öncesi ve sonrası tüm süreçlerde, sorularınızı yanıtlamak ve ihtiyaçlarınıza çözüm bulmak için buradayız.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 text-blue-400"><IconAward /></div>
              <h3 className="mb-2 text-xl font-bold">Kalite ve Konfor</h3>
              <p className="text-gray-400">Geniş ve modern araç filomuzla her ihtiyaca uygun, konforlu ve keyifli bir sürüş deneyimi vaat ediyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bölüm: Eylem Çağrısı (Call to Action) */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Maceranıza Başlamaya Hazır Mısınız?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Aracınızı bugün rezerve edin ve yolculuğun keyfini çıkarın.
          </p>
          <div className="mt-8">
            <Link href="/" className="inline-block rounded-full bg-blue-600 px-8 py-3 font-semibold text-white no-underline transition hover:bg-blue-700">
              Araçları Görüntüle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}