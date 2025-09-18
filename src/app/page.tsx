// app/page.tsx

import { FeaturedCars } from "./_components/FeaturedCars";
import { api } from "~/trpc/server";
import { CarSearchForm } from "./_components/CarSearchForm";
import { AnimatedHeroText } from "./_components/AnimatedHeroText"; // Yeni bileşeni import ediyoruz

const IconMapPin = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCalendar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

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

        <div className="container relative z-10 mx-auto flex flex-grow flex-col items-center justify-center px-4 text-center">

          <div className="container relative z-10 mx-auto flex flex-grow flex-col items-center justify-center px-4 text-center">

            {/* GÜNCELLEME: Eski metinlerin tamamı yerine yeni animasyonlu bileşeni koyduk */}
            <AnimatedHeroText />

          </div>

        </div>

        {/* Arama formunu Hero'nun altına, ayrı bir bölüme taşıdık */}
        <div className="relative z-10 w-full -mb-24 px-4">
          <CarSearchForm />
        </div>
      </section>

      {/* Öne Çıkan Araçlar (Arama formundan sonra başlaması için üstten boşluk ekledik) */}
      <section
        className="relative z-0 pt-32 pb-16 bg-cover bg-center" // pt-32 ile boşluk eklendi
        style={{ backgroundImage: "url('/banner_Background.png')" }}
      >
        <div className="relative container mx-auto px-4">
          <h2 className="text-3xl text-center font-extrabold tracking-tight text-white sm:text-4xl">
            Öne Çıkan Araçlarımız
          </h2>
          <p className="mb-10 text-center text-xl tracking-wide drop-shadow-lg text-gray-400">
            Her ihtiyaca ve bütçeye uygun, popüler araçlarımızı keşfedin.
          </p>
          <FeaturedCars cars={cars} />
        </div>
      </section>
    </main>
  );
}
