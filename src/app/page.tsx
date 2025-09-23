// app/page.tsx

import { FeaturedCars } from "./_components/FeaturedCars";
import { api } from "~/trpc/server";
import { CarSearchForm } from "./_components/CarSearchForm";
import { AnimatedHeroText } from "./_components/AnimatedHeroText";
import Link from "next/link";

// İkonlar (Bu bölümü değiştirmeye gerek yok, kendi dosyanızdaki gibi bırakabilirsiniz)
const IconMapPin = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>);
const IconCalendar = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>);


type HomePageProps = {
  searchParams: {
    locationId?: string;
    startDate?: string;
    endDate?: string;
  };
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const locationId = searchParams.locationId ? parseInt(searchParams.locationId, 10) : undefined;
  const startDate = searchParams.startDate ? new Date(searchParams.startDate) : undefined;
  const endDate = searchParams.endDate ? new Date(searchParams.endDate) : undefined;

  const cars = await api.car.getAll({
    locationId,
    startDate,
    endDate,
  });

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section
        className="relative flex h-screen min-h-[700px] flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

       <div className="container relative z-10 mx-auto px-4 text-center pt-16">
          <AnimatedHeroText />
          <div className="mt-12 w-full">
            <CarSearchForm />
          </div>
        </div>



        {/* Aşağı Kaydır Oku */}
        <div className="absolute bottom-6 z-20">
          <Link href="#featured-cars" aria-label="Aşağı kaydır">
            <svg className="h-8 w-8 animate-bounce text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>

        {/* DALGALI GEÇİŞ */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22,98.15,29.05,146,19.26..." fill="black"></path>
          </svg>
        </div>
      </section>
      {/* Öne Çıkan Araçlar */}
      <section
        id="featured-cars"
        // DEĞİŞİKLİK 1: Bölümün üst ve alt boşlukları azaltıldı (pt-16 pb-16 -> py-20)
        className="relative z-0 py-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/banner_Background.png')" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative container mx-auto px-4">
          <h2 className="text-4xl text-center font-extrabold tracking-tight text-white sm:text-5xl bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Şu An Müsait Olan Araçlarımız
          </h2>
          {/* DEĞİŞİKLİK 2: Başlık ve araçlar arasındaki boşluk azaltıldı (mb-8 -> mb-4) */}
          <p className="text-center text-lg tracking-wide text-gray-400">
            Her ihtiyaca ve bütçeye uygun, popüler araçlarımızı keşfedin.
          </p>
          <FeaturedCars cars={cars} />
        </div>
      </section>
    </main>
  );
}