
import Image from "next/image";
import Link from "next/link";
import { type Car, type PricingTier, type Booking } from "@prisma/client";
import { useState } from "react";

// Tip tanımını güncelliyoruz
type CarWithDetails = Car & {
  pricingTiers: PricingTier[];
  bookings: Booking[];
  previewVideoUrl?: string | null; // <-- BU SATIRI EKLEYİN
};

type CarWithPreview = Car & { previewVideoUrl?: string | null };

export function CarCard({ car }: { car: CarWithDetails }) {
  // En düşük günlük fiyatı bulmak için bir mantık ekleyelim
  // Bu, "Fiyatlar ...'dan başlıyor" demek için kullanılır.
  const startingPrice = car.pricingTiers.reduce((min, tier) => {
    const rate = Number(tier.dailyRate);
    return rate < min ? rate : min;
  }, Number(car.basePrice)); // Başlangıç olarak basePrice'ı al
  const isCurrentlyBooked = car.bookings && car.bookings.length > 0;
  const [isHovered, setIsHovered] = useState(false);

  return (

    <div
      className="flex h-full flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-lg transition-transform duration-300 hover:scale-105 border border-neutral-800 group" // <-- 1. 'group' class'ı eklendi
      onMouseEnter={() => setIsHovered(true)}   // <-- 2. Mouse üzerine gelince state'i true yap
      onMouseLeave={() => setIsHovered(false)}  // <-- 3. Mouse ayrılınca state'i false yap
    >
      <Link href={`/cars/${car.id.toString()}`} className="block">
        <div className="relative w-full aspect-[4/3] bg-neutral-800"> {/* bg-black yerine bg-neutral-800 */}
          {/* Ana Resim (her zaman altta durur) */}
          <Image
            src={car.imageUrl ? `${process.env.NEXT_PUBLIC_APP_URL}${car.imageUrl}` : '/placeholder.png'}
            alt={`${car.marka} ${car.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Önizleme Videosu (sadece hover durumunda ve video varsa görünür) */}
          {isHovered && car.previewVideoUrl && (
            <video
              key={car.id} // Hoverdan sonra videonun baştan başlaması için
              src={car.previewVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            />
          )}
          {/* YENİ: "Kullanımda" şeridi */}
          {isCurrentlyBooked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500%] bg-red-600/90 transform -rotate-30 flex items-center justify-center py-3">
                  <span className="text-white font-bold text-lg tracking-widest">
                    Kullanımda
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-white">{car.marka} {car.model}</h3>
        <p className="text-sm text-gray-400">{car.yil}</p>
        <div className="mt-4 flex-grow">
          {/* Özellikler */}
        </div>
        <div className="mt-4 border-t border-neutral-700 pt-4">
          <p className="text-gray-400">Günlük Fiyat</p>
          <p className="text-2xl font-bold text-yellow-400">
            ₺{startingPrice.toLocaleString('tr-TR')}
            <span className="text-base font-normal text-gray-400">'dan başlayan fiyatlarla</span>
          </p>
        </div>
      </div>
    </div>
  );
}