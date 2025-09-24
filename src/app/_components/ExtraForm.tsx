"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Extra } from "@prisma/client";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

type ExtraFormProps = {
  // Düzenleme modu için mevcut veriyi prop olarak alacağız
  initialData?: Extra | null;
};

export function ExtraForm({ initialData }: ExtraFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const { showAlert } = useAlert(); // Hook'u çağır

  // Form state'leri
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [isDaily, setIsDaily] = useState(true);

  // Eğer düzenleme modundaysak, formu mevcut verilerle doldur
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description ?? '');
      setPrice(Number(initialData.price));
      setIsDaily(initialData.isDaily);
    }
  }, [initialData]);

  const utils = api.useUtils();
  // Yeni ekstra oluşturma mutation'ı
  const createExtra = api.extra.create.useMutation({
    onSuccess: () => {
      showAlert("Ekstra başarıyla oluşturuldu.");
      utils.extra.getAll.invalidate(); // Liste sayfasındaki veriyi yenile
      router.push("/admin/extras");
    },
    onError: (error) => alert(`Hata: ${error.message}`),
  });

  // Ekstra güncelleme mutation'ı
  const updateExtra = api.extra.update.useMutation({
    onSuccess: () => {
      showAlert("Ekstra başarıyla güncellendi.");
      utils.extra.getAll.invalidate();
      router.push("/admin/extras");
    },
    onError: (error) => showAlert(`Hata: ${error.message}`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description: description || undefined,
      price: Number(price),
      isDaily,
    };

    if (isEditMode) {
      updateExtra.mutate({ id: initialData!.id, ...payload });
    } else {
      createExtra.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block font-semibold">Ekstra Adı</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-style"/>
      </div>
      <div>
        <label className="mb-2 block font-semibold">Açıklama (Opsiyonel)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-style" rows={3}/>
      </div>
      <div>
        <label className="mb-2 block font-semibold">Fiyat (TL)</label>
        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="input-style"/>
      </div>
      <div className="flex items-center gap-4">
        <input type="checkbox" id="isDaily" checked={isDaily} onChange={(e) => setIsDaily(e.target.checked)} className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-yellow-500 focus:ring-yellow-600"/>
        <label htmlFor="isDaily" className="font-semibold">Fiyat Günlük Mü?</label>
      </div>
      <button
        type="submit"
        disabled={createExtra.isPending || updateExtra.isPending}
        className="w-full rounded-md bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        {isEditMode ? "Değişiklikleri Kaydet" : "Ekstra Oluştur"}
      </button>
    </form>
  );
}