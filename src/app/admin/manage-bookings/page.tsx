"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

export default function AdminBookingsPage() {
  // 1. Tüm rezervasyonları tRPC ile çekiyoruz
  const { data: bookings, isLoading, error, refetch } = api.booking.getAll.useQuery();

  // 2. Rezervasyon silme işlemi için mutation'ı hazırlıyoruz
  const deleteBookingMutation = api.booking.delete.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      // Silme işlemi başarılı olunca listeyi otomatik olarak yenile
      refetch();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    },
  });

  // 3. Silme butonuna tıklandığında çalışacak fonksiyon
  const handleDelete = (bookingId: number) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      deleteBookingMutation.mutate({ id: bookingId });
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Bir hata oluştu: {error.message}</div>;
  }

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Rezervasyon Yönetimi</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Kullanıcı</th>
              <th className="px-4 py-2 text-left">Araç</th>
              <th className="px-4 py-2 text-left">Başlangıç</th>
              <th className="px-4 py-2 text-left">Bitiş</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-700 hover:bg-gray-600">
                  <td className="px-4 py-2">{booking.id}</td>
                  <td className="px-4 py-2">{booking.user.name ?? booking.user.email}</td>
                  <td className="px-4 py-2">{booking.car.marka} {booking.car.model}</td>
                  <td className="px-4 py-2">{new Date(booking.startDate).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-2">{new Date(booking.endDate).toLocaleString('tr-TR')}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link
                      href={`/admin/manage-bookings/edit/${booking.id}`}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={deleteBookingMutation.isPending}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Henüz hiç rezervasyon bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}