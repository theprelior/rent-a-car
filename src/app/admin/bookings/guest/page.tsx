"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export default function NewGuestBookingPage() {
  const router = useRouter();

  // Form state'leri
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const { showAlert } = useAlert(); // Hook'u çağır

  const { data: availableCars, isLoading: isLoadingCars } = api.car.getAll.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
    { enabled: !!startDate && !!endDate }
  );

  const utils = api.useUtils();
  const createBookingMutation = api.booking.createByAdmin.useMutation({
    onSuccess: () => {
      showAlert("Misafir rezervasyonu başarıyla oluşturuldu!");
      utils.booking.getAll.invalidate();
      router.push("/admin/manage-bookings"); 
    },
    onError: (error) => showAlert(`Bir hata oluştu: ${error.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone || !selectedCarId || !startDate || !endDate) {
      showAlert("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    createBookingMutation.mutate({
      carId: BigInt(selectedCarId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestName: guestName,
      guestPhone: guestPhone,
      guestEmail: guestEmail || undefined,
    });
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Misafir İçin Yeni Rezervasyon</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-md border border-gray-700 p-4">
          <h2 className="text-xl font-semibold">Misafir Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-semibold">Ad Soyad *</label>
              <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} required className="input-style" />
            </div>
            <div>
              <label className="mb-2 block font-semibold">Telefon *</label>
              <input type="tel" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required className="input-style" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block font-semibold">E-posta (Opsiyonel)</label>
              <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="input-style" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">Başlangıç Tarihi *</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="input-style" />
          </div>
          <div>
            <label className="mb-2 block font-semibold">Bitiş Tarihi *</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="input-style" />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-semibold">Müsait Araçlar *</label>
          <select value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)} required disabled={!startDate || !endDate || isLoadingCars} className="input-style">
            <option value="" disabled>
              {isLoadingCars ? "Araçlar Yükleniyor..." : (!startDate || !endDate ? "Önce tarih seçiniz..." : "Araç Seçiniz...")}
            </option>
            {availableCars?.map((car) => (
              <option key={car.id.toString()} value={car.id.toString()}>{car.marka} {car.model} ({car.yil})</option>
            ))}
          </select>
          {availableCars && availableCars.length === 0 && !isLoadingCars && (
             <p className="mt-2 text-yellow-500">Seçili tarihlerde müsait araç bulunmuyor.</p>
          )}
        </div>

        <button type="submit" disabled={createBookingMutation.isPending} className="w-full rounded-md bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50">
          {createBookingMutation.isPending ? "Oluşturuluyor..." : "Rezervasyonu Oluştur"}
        </button>
      </form>
    </div>
  );
}