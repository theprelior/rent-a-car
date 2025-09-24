"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export default function AdminExtrasPage() {
  const { data: extras, isLoading, refetch } = api.extra.getAll.useQuery();
  const { showAlert } = useAlert(); // Hook'u çağır
  
  const deleteExtraMutation = api.extra.delete.useMutation({
    onSuccess: () => {
      showAlert("Ekstra başarıyla silindi.");
      refetch();
    },
    onError: (error) => showAlert(`Hata: ${error.message}`),
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Bu ekstrayı silmek istediğinizden emin misiniz?")) {
      deleteExtraMutation.mutate({ id });
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Ekstra Hizmet Yönetimi</h1>
        <Link href="/admin/extras/new" className="rounded-md bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700">
          Yeni Ekle
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">İsim</th>
              <th className="px-4 py-2 text-left">Fiyat</th>
              <th className="px-4 py-2 text-left">Tip</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {extras?.map((extra) => (
              <tr key={extra.id} className="border-b border-gray-700 hover:bg-gray-600">
                <td className="px-4 py-2">{extra.id}</td>
                <td className="px-4 py-2">{extra.name}</td>
                <td className="px-4 py-2">₺{Number(extra.price).toLocaleString('tr-TR')}</td>
                <td className="px-4 py-2">{extra.isDaily ? 'Günlük' : 'Tek Seferlik'}</td>
                <td className="px-4 py-2 space-x-2">
                  <Link href={`/admin/extras/edit/${extra.id}`} className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
                    Düzenle
                  </Link>
                  <button onClick={() => handleDelete(extra.id)} disabled={deleteExtraMutation.isPending} className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:opacity-50">
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