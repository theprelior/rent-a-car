// app/admin/cars/page.tsx

import Link from "next/link";
import Image from "next/image"; // Image bileşenini import ediyoruz
import { api } from "~/trpc/server";

export default async function AdminCarsPage() {
  const cars = await api.car.getAll();

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Mevcut Araçlar</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Resim</th> {/* ID -> Resim */}
              <th className="px-4 py-2 text-left">Marka</th>
              <th className="px-4 py-2 text-left">Model</th>
              <th className="px-4 py-2 text-left">Yıl</th>
              <th className="px-4 py-2 text-left">Fiyat/Gün</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id} className="border-b border-gray-700 hover:bg-gray-600">
                {/* ID yerine Image bileşenini kullanıyoruz */}
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
                <td className="px-4 py-2">₺{Number(car.fiyat).toLocaleString('tr-TR')}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/cars/edit/${car.id.toString()}`}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Düzenle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}