"use client";

import Image from "next/image";
import Link from "next/link";
import { type Car, type PricingTier, type Location } from "@prisma/client";
import { Fuel, Users, Briefcase, Settings } from "lucide-react";



type CarWithDetails = Car & {
  pricingTiers: PricingTier[];
  location: Location | null;
};

type FilteredCarCardProps = {
  car: CarWithDetails;
  rentalDays: number;
  startDate?: string;
  endDate?: string;
};

export function FilteredCarCard({ car, rentalDays, startDate, endDate }: FilteredCarCardProps) {

  const searchParams = new URLSearchParams();
  if (startDate) searchParams.set('startDate', startDate);
  if (endDate) searchParams.set('endDate', endDate);
  const queryString = searchParams.toString();
  // Tarih seçildiğinde dinamik fiyat hesaplaması
  let dailyRate = Number(car.basePrice);
  if (rentalDays > 0) {
    const tier = car.pricingTiers.find(t => rentalDays >= t.minDays && rentalDays <= t.maxDays);
    if (tier) {
      dailyRate = Number(tier.dailyRate);
    }
  }
  const totalPrice = dailyRate * rentalDays;

  return (
    <div className="grid grid-cols-12 gap-4 rounded-xl bg-neutral-900 p-4 border border-neutral-800 transition-shadow hover:shadow-lg hover:shadow-yellow-500/10">
      {/* 1. Sütun: Resim */}
      <div className="col-span-12 md:col-span-3">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <Image src={car.imageUrl ?? '/car-placeholder.png'} alt={`${car.marka} ${car.model}`} layout="fill" objectFit="cover" />
        </div>
      </div>

      {/* 2. Sütun: Araç Bilgileri (İkonlarla güncellendi) */}
      <div className="col-span-12 md:col-span-6 flex flex-col justify-between py-2">
        <div>
          <h2 className="text-2xl font-bold text-white">{car.marka} {car.model}</h2>
          <p className="text-md text-gray-400">{car.yil} Model</p>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-300">
          <div className="flex items-center gap-2">
            <Fuel className="h-15 w-15 text-yellow-400" />
            <span>{car.yakitTuru}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings className="h-15 w-15 text-yellow-400" />
            <span>{car.vitesTuru.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-15 w-15 text-yellow-400" />
            <span>{car.koltukSayisi} Koltuk</span>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-15 w-15 text-yellow-400" />
            <span>{car.bagajSayisi ?? "N/A"} Bagaj</span>
          </div>
        </div>
      </div>

      {/* 3. Sütun: Fiyat ve Buton */}
      <div className="col-span-12 md:col-span-3 flex flex-col justify-center rounded-lg bg-neutral-800 p-4 text-center">
        {rentalDays > 0 ? (
          <>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Günlük Fiyat: <span className="font-semibold text-white">₺{dailyRate.toLocaleString('tr-TR')}</span></p>
              <p className="text-sm text-gray-400">Toplam Gün: <span className="font-semibold text-white">{rentalDays} Gün</span></p>
              <p className="text-xl font-bold text-yellow-400 mt-2">₺{totalPrice.toLocaleString('tr-TR')}</p>
            </div>
            <Link
              href={`/cars/${car.id.toString()}${queryString ? `?${queryString}` : ''}`}
              className="mt-4 block ...">
              {rentalDays > 0 ? 'Hemen Kirala' : 'Detayları Gör'}
            </Link>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-bold text-yellow-400">₺{Number(car.basePrice).toLocaleString('tr-TR')}</p>
            <p className="text-sm text-gray-400">'dan başlayan fiyatlarla</p>
            <Link href={`/cars/${car.id.toString()}`} className="mt-4 block w-full rounded-md bg-yellow-500 py-2 font-bold text-black transition hover:bg-yellow-600">
              Detayları Gör
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}