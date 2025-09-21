
import Image from "next/image";
import Link from "next/link";
import { type Car, type PricingTier } from "@prisma/client";

// Tip tanımını güncelliyoruz
type CarWithTiers = Car & {
  pricingTiers: PricingTier[];
};

export function CarCard({ car }: { car: CarWithTiers }) {
  // En düşük günlük fiyatı bulmak için bir mantık ekleyelim
  // Bu, "Fiyatlar ...'dan başlıyor" demek için kullanılır.
  const startingPrice = car.pricingTiers.reduce((min, tier) => {
    const rate = Number(tier.dailyRate);
    return rate < min ? rate : min;
  }, Number(car.basePrice)); // Başlangıç olarak basePrice'ı al

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-lg transition-transform duration-300 hover:scale-105 border border-neutral-800">
      <Link href={`/cars/${car.id.toString()}`} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={car.imageUrl ?? '/car-placeholder.png'}
            alt={`${car.marka} ${car.model}`}
            layout="fill"
            objectFit="cover"
          />
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