
import Image from "next/image";
import Link from "next/link";
import { type Car, type PricingTier,type Booking } from "@prisma/client";

// Tip tanımını güncelliyoruz
type CarWithDetails = Car & {
  pricingTiers: PricingTier[];
  bookings: Booking[];
};

export function CarCard({ car }: { car: CarWithDetails  }) {
  // En düşük günlük fiyatı bulmak için bir mantık ekleyelim
  // Bu, "Fiyatlar ...'dan başlıyor" demek için kullanılır.
  const startingPrice = car.pricingTiers.reduce((min, tier) => {
    const rate = Number(tier.dailyRate);
    return rate < min ? rate : min;
  }, Number(car.basePrice)); // Başlangıç olarak basePrice'ı al
  const isCurrentlyBooked = car.bookings && car.bookings.length > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-lg transition-transform duration-300 hover:scale-105 border border-neutral-800">
     <Link href={`/cars/${car.id.toString()}`} className="block">
       <div className="relative h-56 w-full bg-black">
          <Image
            src={car.imageUrl ?? '/car-placeholder.png'}
            alt={`${car.marka} ${car.model}`}
            layout="fill"
            objectFit="contain" // DEĞİŞİKLİK: 'cover' -> 'contain'
          />
          {/* YENİ: "Kullanımda" şeridi */}
          {isCurrentlyBooked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="absolute -bottom-10 -left-10 w-48 h-16 bg-red-600/90 transform -rotate-45 flex items-end justify-center">
                    <span className="text-white font-bold text-lg pb-1">Kullanımda</span>
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