import Link from "next/link";
import { type Metadata } from "next";
import { Award, Heart, ShieldCheck } from "lucide-react"; // İkonları lucide-react'tan alıyoruz

export const metadata: Metadata = {
  title: "Hakkımızda | Rentacar",
  description: "Rentacar olarak misyonumuz, vizyonumuz ve değerlerimiz hakkında daha fazla bilgi edinin.",
};

export default function HakkimizdaPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-16">
      {/* 1. Bölüm: Ana Başlık ve Tanıtım */}
      <section 
        className="relative py-24 sm:py-32 bg-neutral-900"
        style={{ backgroundImage: `url('/background.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Yolculuktaki Güvenilir Partneriniz
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300">
            RENTORA olarak, her yolculuğun özel olduğuna inanıyoruz. Misyonumuz, size sadece bir araba değil, aynı zamanda konfor, güvenlik ve unutulmaz anılar sunmaktır.
          </p>
        </div>
      </section>

      {/* 2. Bölüm: Değerlerimiz */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">Değerlerimiz</h2>
            <p className="mt-4 text-lg text-gray-400">Bizi biz yapan temel ilkelerimiz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Güvenilirlik Kartı */}
            <div className="flex flex-col items-center text-center rounded-xl bg-neutral-900 p-8 border border-neutral-800 transition-all duration-300 hover:border-yellow-500/50 hover:-translate-y-2">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                <ShieldCheck className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Güvenilirlik</h3>
              <p className="text-gray-400">Tüm araçlarımız düzenli olarak bakımdan geçer ve en yüksek güvenlik standartlarına sahiptir. Size ve sevdiklerinize güvenli bir yolculuk sunmak önceliğimizdir.</p>
            </div>

            {/* Müşteri Memnuniyeti Kartı */}
            <div className="flex flex-col items-center text-center rounded-xl bg-neutral-900 p-8 border border-neutral-800 transition-all duration-300 hover:border-yellow-500/50 hover:-translate-y-2">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                <Heart className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Müşteri Memnuniyeti</h3>
              <p className="text-gray-400">7/24 yanınızdayız. Kiralama öncesi ve sonrası tüm süreçlerde, sorularınızı yanıtlamak ve ihtiyaçlarınıza çözüm bulmak için buradayız.</p>
            </div>

            {/* Kalite ve Konfor Kartı */}
            <div className="flex flex-col items-center text-center rounded-xl bg-neutral-900 p-8 border border-neutral-800 transition-all duration-300 hover:border-yellow-500/50 hover:-translate-y-2">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-white">Kalite ve Konfor</h3>
              <p className="text-gray-400">Geniş ve modern araç filomuzla her ihtiyaca uygun, konforlu ve keyifli bir sürüş deneyimi vaat ediyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bölüm: Eylem Çağrısı (Call to Action) */}
      <section className="bg-neutral-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Maceranıza Başlamaya Hazır Mısınız?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
            Aracınızı bugün rezerve edin ve yolculuğun keyfini çıkarın.
          </p>
          <div className="mt-8">
            <Link 
              href="/fiyat-listesi" 
              className="inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-10 py-4 text-lg font-semibold text-black shadow-lg transition-transform hover:scale-105"
            >
              Araç Filosunu Görüntüle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}