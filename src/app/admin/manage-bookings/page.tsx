"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { UserPlus, User } from "lucide-react"; // İkonları import ediyoruz
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export default function AdminBookingsPage() {
  const { data: bookings, isLoading, error, refetch } = api.booking.getAll.useQuery();
  const { showAlert } = useAlert(); // Hook'u çağır
  
  const deleteBookingMutation = api.booking.delete.useMutation({
    onSuccess: (data) => {
      showAlert(data.message);
      refetch();
    },
    onError: (error) => {
      showAlert(`Hata: ${error.message}`);
    },
  });

  const handleDelete = (bookingId: number) => {
    if (window.confirm("Bu rezervasyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      deleteBookingMutation.mutate({ id: bookingId });
    }
  };

  if (isLoading) {
    return <div className="text-white text-center p-10">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-10">Bir hata oluştu: {error.message}</div>;
  }

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Rezervasyon Yönetimi</h1>
        <div className="flex gap-4">
          <Link href="/admin/users" className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
            <User size={18} />
            <span>Üye İçin Oluştur</span>
          </Link>
          <Link href="/admin/bookings/guest" className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700">
            <UserPlus size={18} />
            <span>Misafir İçin Oluştur</span>
          </Link>
        </div>
      </div>

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
                  <td className="px-4 py-2">
                    {booking.user ? (
                      <span className="font-semibold">{booking.user.name ?? booking.user.email}</span>
                    ) : (
                      <span className="italic text-gray-400">{booking.guestName} (Misafir)</span>
                    )}
                  </td>
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