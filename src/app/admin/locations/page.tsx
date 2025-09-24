// app/admin/locations/page.tsx

"use client"; // Form içerdiği için Client Component yapıyoruz

import { api } from "~/trpc/react";
import { useState } from "react";
import { Edit, Trash2, Save, X } from 'lucide-react'; // İkonlar için
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export default function AdminLocationsPage() {
  // Mevcut lokasyonları listelemek için tRPC query'si
  const utils = api.useUtils();
  const { data: locations, refetch: refetchLocations } = api.location.getAll.useQuery();
  const { showAlert } = useAlert(); // Hook'u çağır
  const [locationName, setLocationName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");

  const createLocation = api.location.create.useMutation({
    onSuccess: () => {
      showAlert("Lokasyon başarıyla eklendi!");
      setLocationName("");
      utils.location.getAll.invalidate(); // Cache'i geçersiz kılarak listeyi yenile
    },
    onError: (error) => showAlert(`Hata: ${error.message}`),
  });

  const updateLocation = api.location.update.useMutation({
    onSuccess: () => {
      showAlert("Lokasyon güncellendi!");
      setEditingId(null);
      utils.location.getAll.invalidate();
    },
    onError: (error) => showAlert(`Hata: ${error.message}`),
  });

  const deleteLocation = api.location.delete.useMutation({
    onSuccess: () => {
      showAlert("Lokasyon silindi!");
      utils.location.getAll.invalidate();
    },
    onError: (error) => showAlert(`Hata: ${error.message}`),
  });

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    createLocation.mutate({ name: locationName });
  };

  const handleEditClick = (location: { id: number, name: string }) => {
    setEditingId(location.id);
    setEditedName(location.name);
  };
  
  const handleSaveClick = (id: number) => {
    updateLocation.mutate({ id, name: editedName });
  };
  
  const handleDeleteClick = (id: number) => {
    if (window.confirm("Bu lokasyonu silmek istediğinizden emin misiniz?")) {
      deleteLocation.mutate({ id });
    }
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
        <ul className="space-y-3">
          {locations?.map((location) => (
            <li key={location.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
              {editingId === location.id ? (
                // Düzenleme Modu
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="input-style flex-grow mr-2"
                  />
                  <button onClick={() => handleSaveClick(location.id)} className="p-2 text-green-400 hover:text-green-300"><Save size={20} /></button>
                  <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:text-gray-300"><X size={20} /></button>
                </>
              ) : (
                // Görüntüleme Modu
                <>
                  <span className="flex-grow">{location.name}</span>
                  <div className="flex items-center">
                    <button onClick={() => handleEditClick(location)} className="p-2 text-yellow-400 hover:text-yellow-300"><Edit size={20} /></button>
                    <button onClick={() => handleDeleteClick(location.id)} className="p-2 text-red-500 hover:text-red-400"><Trash2 size={20} /></button>
                  </div>
                </>
              )}
            </li>
          ))}
          {(!locations || locations.length === 0) && <p className="text-gray-400">Henüz lokasyon eklenmemiş.</p>}
        </ul>
      </div>
    </div>

  );
}