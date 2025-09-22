"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Car } from "@prisma/client";

const toDatetimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // Form state'leri
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const nowAsInputMin = toDatetimeLocal(new Date());

  // 1. Sadece seçilen tarihlerde müsait olan araçları getiren tRPC query'si.
  // `enabled` seçeneği sayesinde, sadece başlangıç ve bitiş tarihleri
  // seçildiğinde bu query otomatik olarak çalışacak.
  const { data: availableCars, isLoading: isLoadingCars } = api.car.getAll.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
    {
      enabled: !!startDate && !!endDate, // Sadece iki tarih de doluysa çalıştır
    }
  );

  // 2. Rezervasyonu oluşturacak olan tRPC mutation'ı
  const createBookingMutation = api.booking.createByAdmin.useMutation({
    onSuccess: () => {
      alert("Rezervasyon başarıyla oluşturuldu!");
      router.push("/admin/users"); // İşlem bitince kullanıcılar sayfasına geri dön
    },
    onError: (error) => {
      alert(`Bir hata oluştu: ${error.message}`);
    },
  });

  // 3. Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedCarId || !startDate || !endDate) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      alert("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.");
      return;
    }

    createBookingMutation.mutate({
      userId,
      carId: BigInt(selectedCarId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };

  if (!userId) {
    return (
      <div className="text-center text-red-500">
        Geçerli bir kullanıcı ID'si bulunamadı. Lütfen kullanıcılar sayfasından tekrar deneyin.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Yeni Rezervasyon Oluştur</h1>
      <p className="mb-4 text-gray-400">Kullanıcı ID: <span className="font-mono">{userId}</span></p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tarih Seçimi */}
        <div>
          <label className="block text-sm font-medium mb-1">Başlangıç Tarihi</label>
          <input
            type="datetime-local"
            value={startDate}
            // DÜZELTME: Geçmiş tarihleri engelle
            min={nowAsInputMin}
            onChange={e => setStartDate(e.target.value)}
            required
            className="input-style"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bitiş Tarihi</label>
          <input
            type="datetime-local"
            value={endDate}
            // DÜZELTME: Başlangıç tarihinden öncesini engelle
            min={startDate || nowAsInputMin}
            // DÜZELTME: Başlangıç tarihi seçilmemişse bu alanı pasif yap
            disabled={!startDate}
            onChange={e => setEndDate(e.target.value)}
            required
            className="input-style disabled:opacity-50"
          />
        </div>

        {/* Araç Seçimi */}
        <div>
          <label className="mb-2 block font-semibold">Müsait Araçlar</label>
          <select
            value={selectedCarId}
            onChange={(e) => setSelectedCarId(e.target.value)}
            required
            disabled={!startDate || !endDate || isLoadingCars}
            className="input-style"
          >
            <option value="" disabled>
              {isLoadingCars
                ? "Araçlar Yükleniyor..."
                : "Önce tarih seçiniz..."}
            </option>
            {availableCars?.map((car) => (
              <option key={car.id} value={car.id.toString()}>
                {car.marka} {car.model} ({car.yil})
              </option>
            ))}
          </select>
          {availableCars && availableCars.length === 0 && (
            <p className="mt-2 text-yellow-500">Seçili tarihlerde müsait araç bulunmuyor.</p>
          )}
        </div>

        {/* Buton */}
        <button
          type="submit"
          disabled={createBookingMutation.isPending}
          className="w-full rounded-md bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {createBookingMutation.isPending ? "Oluşturuluyor..." : "Rezervasyonu Oluştur"}
        </button>
      </form>
    </div>
  );
}