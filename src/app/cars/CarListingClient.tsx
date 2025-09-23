"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { type Location, CarCategory, YakitTuru, VitesTuru } from "@prisma/client";
import { FilteredCarCard } from "../_components/FilteredCars"
import { useSearchParams } from "next/navigation"; // <-- 1. useSearchParams'ı import et


type CarListingClientProps = {
  initialLocations: Location[];
};

export function CarListingClient({ initialLocations }: CarListingClientProps) {
  const searchParams = useSearchParams(); // <-- 2. Hook'u çağır

  // Filtre state'leri
  const [startDate, setStartDate] = useState(searchParams.get('startDate') ?? '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') ?? '');
  const [pickupLocationId, setPickupLocationId] = useState<number | undefined>(
    searchParams.get('pickupLocationId') ? Number(searchParams.get('pickupLocationId')) : undefined
  );
  const [dropoffLocationId, setDropoffLocationId] = useState<number | undefined>(
    searchParams.get('dropoffLocationId') ? Number(searchParams.get('dropoffLocationId')) : undefined
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [yakitTuru, setYakitTuru] = useState<YakitTuru | undefined>();
  const [vitesTuru, setVitesTuru] = useState<VitesTuru | undefined>();
  const [category, setCategory] = useState<CarCategory | undefined>();
  const [rentalDays, setRentalDays] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        setRentalDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      } else {
        setRentalDays(0);
      }
    } else {
      setRentalDays(0);
    }
  }, [startDate, endDate]);

  // tRPC query'si. Filtre state'leri değiştikçe otomatik olarak yeniden çalışır.
  const { data: cars, isLoading, isError, refetch } = api.car.getAll.useQuery({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    locationId: pickupLocationId,
    searchTerm, yakitTuru, vitesTuru, category,
  });

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(); // Butona basıldığında da veriyi manuel olarak yeniden çek
  }

  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl text-center font-extrabold mb-8 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Araç Kiralama
        </h1>

        {/* --- DOLDURULMUŞ ANA FİLTRELEME ALANI --- */}
        <form onSubmit={handleFilterSubmit} className="p-6 bg-neutral-900 rounded-xl mb-8 border border-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">Teslim Alış Lokasyonu</label>
              <select value={pickupLocationId ?? ''} onChange={(e) => setPickupLocationId(Number(e.target.value) || undefined)} className="input-style">
                <option value="">Lokasyon Seçin</option>
                {initialLocations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">Teslim Ediş Lokasyonu</label>
              <select value={dropoffLocationId ?? ''} onChange={(e) => setDropoffLocationId(Number(e.target.value) || undefined)} className="input-style">
                <option value="">Lokasyon Seçin</option>
                {initialLocations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">Alış Tarihi</label>
              <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-style [color-scheme:dark]" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400 mb-2 block">Bırakış Tarihi</label>
              <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-style [color-scheme:dark]" />
            </div>
            <button type="submit" className="w-full rounded-lg bg-yellow-500 py-3 font-bold text-black transition hover:bg-yellow-600 h-[42px]">
              Araçları Bul
            </button>
          </div>
        </form>

        {/* İkincil Filtreleme Alanı */}
        <div className="p-6 bg-neutral-900 rounded-xl mb-12 border border-neutral-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="Marka veya model ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-style" />
          <select value={yakitTuru} onChange={(e) => setYakitTuru(e.target.value as YakitTuru || undefined)} className="input-style"><option value="">Yakıt Türü (Tümü)</option>{Object.values(YakitTuru).map(v => <option key={v} value={v}>{v}</option>)}</select>
          <select value={vitesTuru} onChange={(e) => setVitesTuru(e.target.value as VitesTuru || undefined)} className="input-style"><option value="">Vites Türü (Tümü)</option>{Object.values(VitesTuru).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}</select>
          <select value={category} onChange={(e) => setCategory(e.target.value as CarCategory || undefined)} className="input-style"><option value="">Kategori (Tümü)</option>{Object.values(CarCategory).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}</select>
        </div>

        {/* Araç Listesi */}
        <div className="space-y-6">
          {isLoading && <p>Araçlar yükleniyor...</p>}
          {isError && <p>Araçları yüklerken bir hata oluştu.</p>}
          {cars && cars.length === 0 && !isLoading && <p className="text-center text-lg text-gray-400">Bu kriterlere uygun araç bulunamadı.</p>}
          {cars?.map((car) => (
            <FilteredCarCard
              key={car.id.toString()}
              car={car}
              rentalDays={rentalDays}
              startDate={startDate} // <-- startDate'i prop olarak geçir
              endDate={endDate}     // <-- endDate'i prop olarak geçir
            />
          ))}
        </div>

      </div>
    </div>
  );
}