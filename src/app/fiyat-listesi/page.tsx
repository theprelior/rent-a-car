// app/fiyat-listesi/page.tsx

import { type Metadata } from "next";
import { api } from "~/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { type Car, type PricingTier } from "@prisma/client"; // Tipleri import ediyoruz

export const metadata: Metadata = {
  title: "Fiyat Listesi | RENTORA",
  description: "Tüm araçlarımızın detaylı günlük, haftalık ve aylık kiralama fiyatlarını inceleyin.",
};

// --- İkonlar ---
const IconGas = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="15" y1="22" y2="22" /><line x1="4" x2="14" y1="9" y2="9" /><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" /><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" /></svg>);
const IconManualGearbox = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h2l4 12h2l4-12h2" /><circle cx="12" cy="6" r="4" /></svg>);
const IconUsers = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconBriefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const IconScreen = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>);

type CarWithPricing = Car & {
  pricingTiers: PricingTier[];
};

export default async function FiyatListesiPage() {
  // 1. api.car.getAll() zaten pricingTiers'ı da getiriyor
  const cars: CarWithPricing[] = await api.car.getAll();

  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Araç Filomuz ve Fiyat Listesi
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            Tüm ihtiyaçlarınıza yönelik geniş araç seçeneklerimizi ve esnek kiralama fiyatlarımızı keşfedin.
          </p>
        </div>

        <div className="space-y-8">
          {cars.map((car) => (
            <div key={car.id.toString()} className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-xl bg-neutral-900 p-6 shadow-lg transition-transform duration-300 hover:scale-[1.02] border border-transparent hover:border-yellow-500/30">

              {/* Sol: Resim */}
              <div className="lg:col-span-3">
                <div className="relative h-52 w-full overflow-hidden rounded-lg">
                  <Image src={car.imageUrl ?? '/car-placeholder.png'} alt={`${car.marka} ${car.model}`} layout="fill" objectFit="contain" />
                </div>
              </div>

              {/* Orta: Bilgiler ve İkonlar */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white">{car.marka} {car.model}</h2>
                <p className="text-md text-gray-400">{car.vitesTuru.replace('_', ' ')}</p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-base text-gray-300">
                  <span className="flex items-center gap-2"><IconGas />{car.yakitTuru}</span>
                  <span className="flex items-center gap-2"><IconUsers />{car.koltukSayisi} Koltuk</span>
                  <span className="flex items-center gap-2"><IconBriefcase />{car.bagajSayisi ?? 'N/A'} Bagaj</span>
                </div>
              </div>

              {/* Sağ: Fiyat Listesi */}
              <div className="lg:col-span-4 rounded-lg bg-neutral-800 p-6 flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-400">Günlük Fiyatlar</h3>
                  {/* 2. Hard-coded dizi yerine aracın kendi fiyat aralıklarını kullanıyoruz */}
                  {car.pricingTiers && car.pricingTiers.length > 0 ? (
                    <ul className="space-y-2">
                      {car.pricingTiers.sort((a,b) => a.minDays - b.minDays).map(tier => (
                        <li key={tier.id} className="flex justify-between text-lg">
                          <span className="text-gray-400">{tier.minDays}-{tier.maxDays} Gün</span>
                          <span className="font-semibold text-white">₺{Number(tier.dailyRate).toLocaleString('tr-TR')} / gün</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center text-gray-500">
                      Fiyat bilgisi için lütfen iletişime geçin.
                    </div>
                  )}
                </div>
                <Link
                  href={`/cars/${car.id.toString()}`}
                  className="mt-4 block w-full rounded-md bg-yellow-500 py-2 text-center font-bold text-black transition hover:bg-yellow-600"
                >
                  Detayları İncele
                </Link>
              </div>

            </div>
          ))}
        </div>
      </section>
    </div>
  );
}