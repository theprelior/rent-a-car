// app/admin/locations/page.tsx

"use client"; // Form içerdiği için Client Component yapıyoruz

import { api } from "~/trpc/react";
import { useState } from "react";

export default function AdminLocationsPage() {
  // Mevcut lokasyonları listelemek için tRPC query'si
  const { data: locations, refetch: refetchLocations } = api.location.getAll.useQuery();

  const [locationName, setLocationName] = useState("");

  // Yeni lokasyon eklemek için tRPC mutation'ı
  const createLocation = api.location.create.useMutation({
    onSuccess: () => {
      alert("Lokasyon başarıyla eklendi!");
      setLocationName(""); // Input'u temizle
      void refetchLocations(); // Lokasyon listesini yeniden çek ve güncelle
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    },
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    createLocation.mutate({ name: locationName });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
      {/* Yeni Lokasyon Ekleme Formu */}
      <div className="rounded-lg bg-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4">Yeni Lokasyon Ekle</h2>
        <form onSubmit={handleAddLocation} className="space-y-4">
          <div>
            <label htmlFor="locationName" className="block text-sm font-medium mb-1 text-gray-300">
              Lokasyon Adı (Örn: Adana Havalimanı)
            </label>
            <input
              id="locationName"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
              className="input-style"
            />
          </div>
          <button type="submit" disabled={createLocation.isPending} className="w-full rounded-md bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:bg-gray-500">
            {createLocation.isPending ? "Ekleniyor..." : "Lokasyon Ekle"}
          </button>
        </form>
      </div>

      {/* Mevcut Lokasyonlar Listesi */}
      <div className="rounded-lg bg-gray-800 p-6">
        <h2 className="text-2xl font-bold mb-4">Mevcut Lokasyonlar</h2>
        <ul className="space-y-2">
          {locations?.map((location) => (
            <li key={location.id} className="bg-gray-700 p-3 rounded-md">
              {location.name}
            </li>
          ))}
          {!locations || locations.length === 0 && <p className="text-gray-400">Henüz lokasyon eklenmemiş.</p>}
        </ul>
      </div>
    </div>
  );
}