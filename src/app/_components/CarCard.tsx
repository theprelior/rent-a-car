// app/_components/CarCard.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { type Car } from "@prisma/client";

// GÜNCELLEME: Prop tipini Decimal yerine string kabul edecek şekilde değiştiriyoruz.
// Bu, Sunucu->İstemci sınırını güvenli bir şekilde geçmek için gereklidir.
export type PlainCar = Omit<Car, 'id' | 'fiyat' | 'motorHacmi'> & {
  id: string;
  fiyat: string | null;
  motorHacmi: string | null;
}

type CarCardProps = {
  car: PlainCar; // Artık yeni PlainCar tipini kullanıyor
};
export function CarCard({ car }: CarCardProps) {
  return (
    <div className="w-[18rem] sm:w-[22rem] md:w-[26rem] lg:w-[28rem] flex-shrink-0 overflow-hidden rounded-2xl bg-gray-800 shadow-2xl snap-start transition-transform duration-300 hover:scale-105">
      {/* Resim */}
      <div className="relative h-64 w-full">
        <Image
          src={car.imageUrl ?? '/car-placeholder.png'}
          alt={`${car.marka} ${car.model}`}
          fill
          className="object-cover"
        />
      </div>

      {/* İçerik */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white">{car.marka} {car.model}</h3>
        <p className="text-md text-gray-400">{car.yil}</p>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-xl font-semibold text-yellow-400">
            {car.fiyat ? `₺${Number(car.basePrice).toLocaleString('tr-TR')}` : 'N/A'}
            <span className="text-sm font-normal text-gray-400"> /gün</span>
          </p>
          <Link
            href={`/cars/${car.id.toString()}`}
            className="rounded-md bg-yellow-500 px-6 py-2 text-sm font-bold text-black transition hover:bg-yellow-600"
          >
            Kirala
          </Link>
        </div>
      </div>
    </div>


  );
}