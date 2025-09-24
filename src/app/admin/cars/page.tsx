"use client"; // <-- 1. Sayfayı Client Component yapıyoruz

import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react"; // <-- 2. 'react' importunu kullanıyoruz
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export default function AdminCarsPage() {
  // 3. Veriyi useQuery hook'u ile çekiyoruz
  const { data: cars, isLoading, error, refetch } = api.car.getAll.useQuery();
  const { showAlert } = useAlert(); // Hook'u çağır
  
  // 4. Araç silme işlemi için mutation'ı hazırlıyoruz
  const deleteCarMutation = api.car.delete.useMutation({
    onSuccess: (data) => {
      showAlert(data.message);
      refetch(); // Silme işlemi sonrası listeyi yenile
    },
    onError: (error) => {
      showAlert(`Hata: ${error.message}`);
    },
  });

  // 5. Silme butonuna basıldığında çalışacak fonksiyon
  const handleDelete = (carId: bigint) => {
    if (window.confirm("Bu aracı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      deleteCarMutation.mutate({ id: carId });
    }
  };

  if (isLoading) return <div>Araçlar yükleniyor...</div>;
  if (error) return <div>Bir hata oluştu: {error.message}</div>;

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Mevcut Araçlar</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Resim</th>
              <th className="px-4 py-2 text-left">Marka</th>
              <th className="px-4 py-2 text-left">Model</th>
              <th className="px-4 py-2 text-left">Yıl</th>
              <th className="px-4 py-2 text-left">Fiyat/Gün</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {cars?.map((car) => (
              <tr key={car.id.toString()} className="border-b border-gray-700 hover:bg-gray-600">
                <td className="px-4 py-2">
                  <div className="relative h-12 w-20">
                    <Image
                      src={car.imageUrl ?? '/car-placeholder.png'}
                      alt={`${car.marka} ${car.model}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{car.marka}</td>
                <td className="px-4 py-2">{car.model}</td>
                <td className="px-4 py-2">{car.yil}</td>
                <td className="px-4 py-2">₺{Number(car.basePrice).toLocaleString('tr-TR')}</td>
                <td className="px-4 py-2 space-x-2"> {/* İşlemleri yan yana getirmek için */}
                  <Link
                    href={`/admin/cars/edit/${car.id.toString()}`}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Düzenle
                  </Link>
                  {/* 6. SİL BUTONU BURADA */}
                  <button
                    onClick={() => handleDelete(car.id)}
                    disabled={deleteCarMutation.isPending}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}