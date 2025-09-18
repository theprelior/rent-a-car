// app/_components/AddCarForm.tsx

"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { YakitTuru, VitesTuru, KasaTipi, CekisTipi, Durum, type Car } from "@prisma/client";
import Image from "next/image";

// Sunucudan gelen ve serialize edilmiş araç verisinin tipi
export type PlainCar = Omit<Car, 'id' | 'fiyat' | 'motorHacmi'> & {
    id: string;
    fiyat: string | null;
    motorHacmi: string | null;
}

// Formun state'i için başlangıç durumu
const initialState = {
  id: undefined as string | undefined,
  marka: "", model: "", yil: new Date().getFullYear().toString(),
  yakitTuru: YakitTuru.Benzin, vitesTuru: VitesTuru.Manuel, sasiNo: "",
  motorHacmi: "", beygirGucu: "", fiyat: "", kilometre: "", durum: Durum.Kiralik,
  kasaTipi: KasaTipi.Sedan, cekisTipi: CekisTipi.Onden_cekis, kapiSayisi: "4",
  koltukSayisi: "5", renk: "", plaka: "", donanimPaketi: "",
  ekstraOzellikler: "", locationId: "",
};

// Yardımcı FormField bileşeni
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>{children}</div>
);

type AddCarFormProps = { initialData?: PlainCar | null; };

export function AddCarForm({ initialData }: AddCarFormProps) {
  const [formData, setFormData] = useState<any>(initialState);
  const [file, setFile] = useState<File | null>(null);

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      // DÜZELTME: Gelen verideki tüm sayısal/özel tipleri form state'ine uygun string'lere çeviriyoruz.
      setFormData({
        ...initialData,
        id: initialData.id, // Zaten string
        yil: initialData.yil.toString(),
        motorHacmi: initialData.motorHacmi ?? '',
        beygirGucu: initialData.beygirGucu?.toString() ?? '',
        kapiSayisi: initialData.kapiSayisi?.toString() ?? '',
        koltukSayisi: initialData.koltukSayisi?.toString() ?? '',
        fiyat: initialData.fiyat ?? '',
        kilometre: initialData.kilometre?.toString() ?? '',
        locationId: initialData.locationId?.toString() ?? '',
        ekstraOzellikler: initialData.ekstraOzellikler.join(', '),
      });
    }
  }, [initialData]);

  const { data: locations, isLoading: isLoadingLocations } = api.location.getAll.useQuery();
  const utils = api.useUtils();

  const createCar = api.car.create.useMutation({
    onSuccess: () => {
      alert("Araç başarıyla eklendi!");
      setFormData(initialState);
      setFile(null);
      const fileInput = document.getElementById('car-image') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      void utils.car.getAll.invalidate();
    },
    onError: (error) => { alert(`Hata: ${error.message}`); },
  });

  const updateCar = api.car.update.useMutation({
    onSuccess: () => {
      alert("Araç başarıyla güncellendi!");
      void utils.car.getAll.invalidate();
      if (initialData?.id) {
          void utils.car.getById.invalidate({ id: BigInt(initialData.id) });
      }
    },
    onError: (error) => { alert(`Hata: ${error.message}`); },
  });

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] || null); // Eğer e.target.files[0] undefined ise null ata
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl: string | undefined | null = isEditMode ? initialData?.imageUrl : undefined;

    if (file) {
      const formPayload = new FormData();
      formPayload.append("file", file);
      try {
        const response = await fetch('/api/upload', { method: 'POST', body: formPayload });
        if (!response.ok) throw new Error('Resim yüklenemedi.');
        const data = await response.json() as { url: string };
        imageUrl = data.url;
      } catch (error) {
        console.error(error);
        alert("Resim yüklenirken bir hata oluştu.");
        return;
      }
    }

    const payload = {
      ...formData,
      imageUrl: imageUrl ?? undefined,
      yil: Number(formData.yil),
      motorHacmi: formData.motorHacmi ? Number(formData.motorHacmi) : undefined,
      beygirGucu: formData.beygirGucu ? Number(formData.beygirGucu) : undefined,
      kapiSayisi: formData.kapiSayisi ? Number(formData.kapiSayisi) : undefined,
      koltukSayisi: formData.koltukSayisi ? Number(formData.koltukSayisi) : undefined,
      fiyat: formData.fiyat ? Number(formData.fiyat) : undefined,
      kilometre: formData.kilometre ? Number(formData.kilometre) : undefined,
      locationId: formData.locationId ? Number(formData.locationId) : undefined,
      ekstraOzellikler: formData.ekstraOzellikler.split(',').map((item: string) => item.trim()).filter(Boolean),
    };
    
    if (isEditMode && initialData) {
      updateCar.mutate({ ...payload, id: BigInt(initialData.id) });
    } else {
      const { id, ...createPayload } = payload; // ID'yi create payload'ından çıkar
      createCar.mutate(createPayload);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof initialState) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-gray-800 p-6">
      <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2">
        {isEditMode ? "Aracı Düzenle" : "Yeni Araç Ekle"}
      </h2>
      
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full">
            <FormField label="Araç Resmi">
                {isEditMode && initialData?.imageUrl && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Mevcut Resim:</p>
                        <Image src={initialData.imageUrl} alt="Mevcut araç resmi" width={150} height={100} className="rounded-md object-cover" />
                    </div>
                )}
                <input id="car-image" type="file" onChange={handleFileChange} accept="image/*" className="input-style" />
                {isEditMode && <p className="text-xs text-gray-500 mt-1">Yeni bir resim yüklerseniz mevcut resimle değiştirilecektir.</p>}
            </FormField>
        </div>
        
        <FormField label="Marka *"><input name="marka" value={formData.marka ?? ''} onChange={handleChange} placeholder="Toyota" required className="input-style" /></FormField>
        <FormField label="Model *"><input name="model" value={formData.model ?? ''} onChange={handleChange} placeholder="Corolla" required className="input-style" /></FormField>
        <FormField label="Yıl *"><input name="yil" value={formData.yil ?? ''} onChange={handleChange} type="number" placeholder="2023" required className="input-style" /></FormField>
        <FormField label="Şasi No *"><input name="sasiNo" value={formData.sasiNo ?? ''} onChange={handleChange} placeholder="ABC123XYZ789" required className="input-style" /></FormField>
        <FormField label="Plaka (Opsiyonel)"><input name="plaka" value={formData.plaka ?? ''} onChange={handleChange} placeholder="31 ABC 123" className="input-style" /></FormField>
        <FormField label="Renk (Opsiyonel)"><input name="renk" value={formData.renk ?? ''} onChange={handleChange} placeholder="Beyaz" className="input-style" /></FormField>
        <FormField label="Donanım Paketi (Opsiyonel)"><input name="donanimPaketi" value={formData.donanimPaketi ?? ''} onChange={handleChange} placeholder="Premium Plus" className="input-style" /></FormField>
        <FormField label="Fiyat/Gün (Opsiyonel)"><input name="fiyat" value={formData.fiyat ?? ''} onChange={handleChange} type="number" step="0.01" placeholder="1500" className="input-style" /></FormField>
        <FormField label="Kilometre (Opsiyonel)"><input name="kilometre" value={formData.kilometre ?? ''} onChange={handleChange} type="number" placeholder="55000" className="input-style" /></FormField>
        <FormField label="Motor Hacmi (Litre, ör: 1.6)"><input name="motorHacmi" value={formData.motorHacmi ?? ''} onChange={handleChange} type="number" step="0.1" placeholder="1.6" className="input-style" /></FormField>
        <FormField label="Beygir Gücü (HP)"><input name="beygirGucu" value={formData.beygirGucu ?? ''} onChange={handleChange} type="number" placeholder="130" className="input-style" /></FormField>
        <FormField label="Kapı Sayısı"><input name="kapiSayisi" value={formData.kapiSayisi ?? ''} onChange={handleChange} type="number" placeholder="4" className="input-style" /></FormField>
        <FormField label="Koltuk Sayısı"><input name="koltukSayisi" value={formData.koltukSayisi ?? ''} onChange={handleChange} type="number" placeholder="5" className="input-style" /></FormField>
        <FormField label="Yakıt Türü *"><select name="yakitTuru" value={formData.yakitTuru} onChange={handleChange} className="input-style">{Object.values(YakitTuru).map(v => <option key={v} value={v}>{v}</option>)}</select></FormField>
        <FormField label="Vites Türü *"><select name="vitesTuru" value={formData.vitesTuru} onChange={handleChange} className="input-style">{Object.values(VitesTuru).map(v => <option key={v} value={v}>{v}</option>)}</select></FormField>
        <FormField label="Kasa Tipi"><select name="kasaTipi" value={formData.kasaTipi} onChange={handleChange} className="input-style">{Object.values(KasaTipi).map(v => <option key={v} value={v}>{v}</option>)}</select></FormField>
        <FormField label="Çekiş Tipi"><select name="cekisTipi" value={formData.cekisTipi} onChange={handleChange} className="input-style">{Object.values(CekisTipi).map(v => <option key={v} value={v}>{v}</option>)}</select></FormField>
        <FormField label="Durum"><select name="durum" value={formData.durum} onChange={handleChange} className="input-style">{Object.values(Durum).map(v => <option key={v} value={v}>{v}</option>)}</select></FormField>
        <FormField label="Ekstra Özellikler (virgülle ayırın)"><input name="ekstraOzellikler" value={formData.ekstraOzellikler ?? ''} onChange={handleChange} placeholder="Sunroof, Deri Koltuk, Navigasyon" className="input-style" /></FormField>
        <FormField label="Lokasyon *">
            <select name="locationId" value={formData.locationId} onChange={handleChange} required className="input-style">
                <option value="" disabled>Lokasyon Seçiniz</option>
                {isLoadingLocations && <option>Yükleniyor...</option>}
                {locations?.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                ))}
            </select>
        </FormField>
      </div>
      
      <button type="submit" disabled={createCar.isPending || updateCar.isPending} className="w-full rounded-md bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700 disabled:bg-gray-500">
        {isEditMode ? "Aracı Güncelle" : "Aracı Kaydet"}
      </button>
    </form>
  );
}