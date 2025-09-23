// app/_components/CarSearchForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toDatetimeLocal } from "~/utils/date"; // <-- Yardımcı fonksiyonu import et

// İkonlar
const IconMapPin = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg> );
const IconCalendar = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg> );
const IconClock = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> );

export function CarSearchForm() {
 const router = useRouter();
  const { data: locations, isLoading: isLoadingLocations } = api.location.getAll.useQuery();

  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
        alert("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");
        return;
    }
    const params = new URLSearchParams();

    
   // Seçilen tüm değerleri URL parametrelerine ekle
    if (pickupLocationId) params.append("pickupLocationId", pickupLocationId);
    if (dropoffLocationId) params.append("dropoffLocationId", dropoffLocationId);
    if (startDate && startTime) {
      // Tarih ve saati birleştirip tam bir tarih formatı oluştur
      const fullStartDate = new Date(`${startDate}T${startTime}`);
      params.append("startDate", fullStartDate.toISOString().substring(0, 16));
    }
    if (endDate && endTime) {
      const fullEndDate = new Date(`${endDate}T${endTime}`);
      params.append("endDate", fullEndDate.toISOString().substring(0, 16));
    }
    
    // DEĞİŞİKLİK: Kullanıcıyı ana sayfa yerine /araclar sayfasına yönlendir
    router.push(`/cars?${params.toString()}`);
  };
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSearch} className="mx-auto mt-10 w-full max-w-4xl rounded-2xl bg-gray-900/50 p-6 shadow-xl backdrop-blur-lg">
      
     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Alış & Bırakış Lokasyonları */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">Teslim Alış Lokasyonu</label>
          <div className="relative"><IconMapPin /><select value={pickupLocationId} onChange={(e) => setPickupLocationId(e.target.value)} required className="w-full appearance-none rounded-md border-gray-600 bg-gray-700/50 py-3 pl-11 pr-4 text-white focus:border-blue-500 focus:ring-blue-500"><option value="" disabled>Seçiniz...</option>{isLoadingLocations && <option>Yükleniyor...</option>}{locations?.map(l => ( <option key={l.id} value={l.id}>{l.name}</option> ))}</select></div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">Teslim Ediş Lokasyonu</label>
          <div className="relative"><IconMapPin /><select value={dropoffLocationId} onChange={(e) => setDropoffLocationId(e.target.value)} required className="w-full appearance-none rounded-md border-gray-600 bg-gray-700/50 py-3 pl-11 pr-4 text-white focus:border-blue-500 focus:ring-blue-500"><option value="" disabled>Seçiniz...</option>{isLoadingLocations && <option>Yükleniyor...</option>}{locations?.map(l => ( <option key={l.id} value={l.id}>{l.name}</option> ))}</select></div>
        </div>

        {/* Alış Tarih & Saat */}
        <div>
            <label className="mb-2 block text-sm font-semibold text-white">Alış Tarihi</label>
            <div className="flex gap-2">
                <div className="relative w-3/5">
                    <IconCalendar />
                    <input 
                        value={startDate} 
                        min={today} 
                        onChange={(e) => setStartDate(e.target.value)} // DÜZELTME
                        type="date" 
                        required 
                        className="w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-11 pr-2 text-white focus:border-blue-500 focus:ring-blue-500 [color-scheme:dark]" 
                    />
                </div>
                <div className="relative w-2/5">
                    <IconClock />
                    <input 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        type="time" 
                        required 
                        className="w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-11 pr-2 text-white focus:border-blue-500 focus:ring-blue-500 [color-scheme:dark]" 
                    />
                </div>
            </div>
        </div>
        
        {/* Bırakış Tarih & Saat */}
        <div>
            <label className="mb-2 block text-sm font-semibold text-white">Bırakış Tarihi</label>
            <div className="flex gap-2">
                <div className="relative w-3/5">
                    <IconCalendar />
                    <input 
                        value={endDate} 
                        min={startDate || today} 
                        disabled={!startDate} 
                        onChange={(e) => setEndDate(e.target.value)} // DÜZELTME
                        type="date" 
                        required 
                        className="w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-11 pr-2 text-white focus:border-blue-500 focus:ring-blue-500 [color-scheme:dark] disabled:opacity-50" 
                    />
                </div>
                <div className="relative w-2/5">
                    <IconClock />
                    <input 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        type="time" 
                        required 
                        className="w-full rounded-md border-gray-600 bg-gray-700/50 py-3 pl-11 pr-2 text-white focus:border-blue-500 focus:ring-blue-500 [color-scheme:dark]" 
                    />
                </div>
            </div>
        </div>
      </div>

      <button type="submit" className="mt-6 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 text-lg font-bold text-black shadow-lg transition-transform hover:scale-105">
        Müsait Araçları Bul
      </button>
    </form>
  );
}