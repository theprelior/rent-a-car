"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

// Tarih objesini 'yyyy-MM-ddThh:mm' formatına çeviren yardımcı fonksiyon
const formatDateForInput = (date: Date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  const hours = (`0${d.getHours()}`).slice(-2);
  const minutes = (`0${d.getMinutes()}`).slice(-2);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.id);
  const { showAlert } = useAlert(); // Hook'u çağır

  // Form state'leri
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');

  // 1. Düzenlenecek rezervasyonun mevcut verilerini çek
  const { data: bookingData, isLoading: isLoadingBooking } = api.booking.getById.useQuery(
    { id: bookingId },
    { enabled: !!bookingId }
  );

  // 2. Form state'lerini, veri yüklendiğinde doldur
  useEffect(() => {
    if (bookingData) {
      setStartDate(formatDateForInput(bookingData.startDate));
      setEndDate(formatDateForInput(bookingData.endDate));
      setSelectedCarId(bookingData.carId.toString());
    }
  }, [bookingData]);

  // 3. Seçilen tarihlerdeki müsait araçları getir
  const { data: availableCars, isLoading: isLoadingCars } = api.car.getAll.useQuery(
    {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
    { enabled: !!startDate && !!endDate }
  );

  // 4. Rezervasyonu güncelleyecek mutation
  const updateBookingMutation = api.booking.update.useMutation({
    onSuccess: () => {
      showAlert("Rezervasyon başarıyla güncellendi!");
      router.push("/admin/manage-bookings");
      router.refresh(); // Liste sayfasının da güncellenmesini tetikle
    },
    onError: (error) => {
      showAlert(`Güncelleme hatası: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCarId || !startDate || !endDate) return;

    updateBookingMutation.mutate({
      id: bookingId,
      carId: BigInt(selectedCarId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };

  if (isLoadingBooking) return <div>Rezervasyon bilgileri yükleniyor...</div>;
  if (!bookingData) return <div>Rezervasyon bulunamadı.</div>;

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-2 text-3xl font-bold">Rezervasyonu Düzenle</h1>
      <p className="mb-6 text-gray-400">
        Kullanıcı:  <span className="font-semibold">
          {/* DÜZELTME: user'ın varlığını kontrol et */}
          {bookingData.user
            ? (bookingData.user.name ?? bookingData.user.email)
            : `${bookingData.guestName} (Misafir)`
          }
        </span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">Başlangıç Tarihi</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="input-style" />
          </div>
          <div>
            <label className="mb-2 block font-semibold">Bitiş Tarihi</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="input-style" />
          </div>
        </div>
        <div>
          <label className="mb-2 block font-semibold">Araç</label>
          <select value={selectedCarId} onChange={(e) => setSelectedCarId(e.target.value)} required disabled={!startDate || !endDate || isLoadingCars} className="input-style">
            <option value="" disabled>Lütfen bir araç seçin</option>
            {/* Mevcut seçili aracı her zaman listeye ekle */}
            <option key={bookingData.carId} value={bookingData.carId.toString()}>
              {bookingData.car.marka} {bookingData.car.model} (Mevcut Seçim)
            </option>
            {/* Müsait araçları listele (mevcut seçim hariç) */}
            {availableCars?.filter(car => car.id !== bookingData.carId).map((car) => (
              <option key={car.id} value={car.id.toString()}>
                {car.marka} {car.model} ({car.yil})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={updateBookingMutation.isPending} className="w-full rounded-md bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
          {updateBookingMutation.isPending ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
        </button>
      </form>
    </div>
  );
}