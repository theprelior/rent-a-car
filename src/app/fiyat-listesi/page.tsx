// app/fiyat-listesi/page.tsx

import { type Metadata } from "next";
import { api } from "~/trpc/server";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Fiyat Listesi | Rentacar",
  description: "Tüm araçlarımızın detaylı günlük, haftalık ve aylık kiralama fiyatlarını inceleyin.",
};

// --- İkonlar ---
const IconGas = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="15" y1="22" y2="22" /><line x1="4" x2="14" y1="9" y2="9" /><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" /><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" /></svg>);
const IconManualGearbox = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6h2l4 12h2l4-12h2" /><circle cx="12" cy="6" r="4" /></svg>);
const IconUsers = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconBriefcase = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const IconScreen = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>);

const pricingTiers = [
  { label: "1-3 Gün", discount: 1.0 },
  { label: "4-7 Gün", discount: 0.95 },
  { label: "8-15 Gün", discount: 0.90 },
  { label: "16-21 Gün", discount: 0.85 },
  { label: "22-30 Gün", discount: 0.80 },
  { label: "Aylık+", discount: 0.75 },
];

export default async function FiyatListesiPage() {
  const cars = await api.car.getAll();

  return (
    <div className="bg-gray-800">
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Araç Filomuz ve Fiyat Listesi
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Tüm ihtiyaçlarınıza yönelik geniş araç seçeneklerimizi ve esnek kiralama fiyatlarımızı keşfedin.
          </p>
        </div>

        <div className="space-y-8">
          {cars.map((car) => (
            <div key={car.id} className="grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-xl bg-gray-900 p-6 shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:ring-1 hover:ring-gray-700">

              {/* Sol: Resim */}
              <div className="lg:col-span-3">
                <div className="relative h-52 w-full overflow-hidden rounded-lg">
                  <Image src={car.imageUrl ?? '/car-placeholder.png'} alt={`${car.marka} ${car.model}`} layout="fill" objectFit="cover" />
                </div>
              </div>

              {/* Orta: Bilgiler ve İkonlar */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white">{car.marka} {car.model}</h2>
                <p className="text-md text-gray-400">{car.vitesTuru.replace('_', ' ')}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-base text-gray-300">
                  <span className="flex items-center gap-2"><IconGas />{car.yakitTuru}</span>
                  <span className="flex items-center gap-2"><IconManualGearbox />{car.vitesTuru.replace('_', ' ')}</span>
                  <span className="flex items-center gap-2"><IconUsers />{car.koltukSayisi} Koltuk</span>
                  <span className="flex items-center gap-2"><IconBriefcase />{car.bagajSayisi ?? 'N/A'} Bagaj</span>
                  <span className="flex items-center gap-2"><IconScreen />Dijital Ekran</span>
                </div>
              </div>

              {/* Sağ: Fiyat Listesi */}
              <div className="lg:col-span-4 rounded-lg bg-gray-800 p-6">
                <ul className="space-y-2">
                  {pricingTiers.map(tier => {
                    const dailyPrice = car.fiyat ? Number(car.fiyat) * tier.discount : null;
                    return (
                      <li key={tier.label} className="flex justify-between text-lg">
                        <span className="text-gray-400">{tier.label}</span>
                        <span className="font-semibold text-white">{dailyPrice ? `₺${dailyPrice.toFixed(0)} / gün` : 'Sorunuz'}</span>
                      </li>
                    )
                  })}
                </ul>
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