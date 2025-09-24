// app/_components/AddCarForm.tsx

"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { YakitTuru, VitesTuru, KasaTipi, CekisTipi, Durum, CarCategory, type Car, type PricingTier } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

// Sunucudan gelen ve serialize edilmiş araç verisinin tipi
export type PlainCar = Omit<Car, 'id' | 'basePrice' | 'motorHacmi' | 'pricingTiers'> & {
  id: string;
  basePrice: string;
  motorHacmi: string | null;
  pricingTiers: PricingTierState[];
};

type PricingTierState = {
  minDays: string;
  maxDays: string;
  dailyRate: string;
};

type CarWithTiers = Car & { pricingTiers: PricingTier[] };

// Formun state'i için başlangıç durumu
const initialState = {
  id: undefined as string | undefined,
  marka: "", model: "", yil: new Date().getFullYear().toString(),
  yakitTuru: YakitTuru.Benzin, vitesTuru: VitesTuru.Manuel, sasiNo: "",
  motorHacmi: "", beygirGucu: "", kilometre: "", durum: Durum.Kiralik,
  kasaTipi: KasaTipi.Sedan, cekisTipi: CekisTipi.Onden_cekis, kapiSayisi: "4",
  koltukSayisi: "5", renk: "", plaka: "", donanimPaketi: "",
  ekstraOzellikler: "", locationId: "", basePrice: "", bagajSayisi: "2", category: CarCategory.EKONOMIK, // <-- YENİ
};

// Yardımcı FormField bileşeni
const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>{children}</div>
);

type AddCarFormProps = { initialData?: PlainCar | null; };

export function AddCarForm({ initialData }: AddCarFormProps) {
  const { showAlert } = useAlert(); // Hook'u çağır
  const router = useRouter();
  const [formData, setFormData] = useState<any>(initialState);
  const [file, setFile] = useState<File | null>(null);
  const [pricingTiers, setPricingTiers] = useState<PricingTierState[]>([
    { minDays: '1', maxDays: '3', dailyRate: '' }
  ]);
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      // DÜZELTME: Gelen verideki tüm sayısal/özel tipleri form state'ine uygun string'lere çeviriyoruz.
      const { pricingTiers, ...carData } = initialData;
      setFormData({
        ...initialData,
        id: initialData.id, // Zaten string
        yil: initialData.yil.toString(),
        motorHacmi: initialData.motorHacmi ?? '',
        beygirGucu: initialData.beygirGucu?.toString() ?? '',
        kapiSayisi: initialData.kapiSayisi?.toString() ?? '',
        koltukSayisi: initialData.koltukSayisi?.toString() ?? '',
        bagajSayisi: initialData.bagajSayisi?.toString() ?? '2', // <-- YENİ
        kilometre: initialData.kilometre?.toString() ?? '',
        locationId: initialData.locationId?.toString() ?? '',
        ekstraOzellikler: initialData.ekstraOzellikler.join(', '),
        basePrice: Number(initialData.basePrice).toString(),

      });
      if (pricingTiers && pricingTiers.length > 0) {
        setPricingTiers(pricingTiers.map(tier => ({
          minDays: tier.minDays.toString(),
          maxDays: tier.maxDays.toString(),
          dailyRate: Number(tier.dailyRate).toString(),
        })));
      }
    }
  }, [initialData]);

  const { data: locations, isLoading: isLoadingLocations } = api.location.getAll.useQuery();
  const utils = api.useUtils();

  const createCar = api.car.create.useMutation({
    onSuccess: () => {
      showAlert("Araç başarıyla eklendi!");
      setFormData(initialState);
      setFile(null);
      const fileInput = document.getElementById('car-image') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      void utils.car.getAll.invalidate();
    },
    onError: (error) => { showAlert(`Hata: ${error.message}`); },
  });

  const updateCar = api.car.update.useMutation({
    onSuccess: () => {
      showAlert("Araç başarıyla güncellendi!");
      void utils.car.getAll.invalidate();
      if (initialData?.id) {
        void utils.car.getById.invalidate({ id: BigInt(initialData.id) });
      }
    },
    onError: (error) => { showAlert(`Hata: ${error.message}`); },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0] || null); // Eğer e.target.files[0] undefined ise null ata
    }
  };
  const handleTierChange = (index: number, field: keyof PricingTierState, value: string) => {
    const newTiers = [...pricingTiers];
    const tier = newTiers[index];
    if (tier) {
      tier[field] = value;
      setPricingTiers(newTiers);
    }
  };


  const addTier = () => setPricingTiers([...pricingTiers, { minDays: '', maxDays: '', dailyRate: '' }]);

  const removeTier = (index: number) => {
    if (pricingTiers.length > 1) {
      setPricingTiers(pricingTiers.filter((_, i) => i !== index));
    } else {
      showAlert("En az bir fiyat aralığı olmalıdır.");
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
        showAlert("Resim yüklenirken bir hata oluştu.");
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
      bagajSayisi: formData.bagajSayisi ? Number(formData.bagajSayisi) : undefined, // <-- YENİ
      kilometre: formData.kilometre ? Number(formData.kilometre) : undefined,
      locationId: formData.locationId ? Number(formData.locationId) : undefined,
      ekstraOzellikler: formData.ekstraOzellikler.split(',').map((item: string) => item.trim()).filter(Boolean),
      pricingTiers: pricingTiers.map(tier => ({
        minDays: Number(tier.minDays),
        maxDays: Number(tier.maxDays),
        dailyRate: Number(tier.dailyRate),
      })),
      basePrice: Number(formData.basePrice), // <-- YENİ

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
        <FormField label="Kilometre (Opsiyonel)"><input name="kilometre" value={formData.kilometre ?? ''} onChange={handleChange} type="number" placeholder="55000" className="input-style" /></FormField>
        <FormField label="Motor Hacmi (Litre, ör: 1.6)"><input name="motorHacmi" value={formData.motorHacmi ?? ''} onChange={handleChange} type="number" step="0.1" placeholder="1.6" className="input-style" /></FormField>
        <FormField label="Beygir Gücü (HP)"><input name="beygirGucu" value={formData.beygirGucu ?? ''} onChange={handleChange} type="number" placeholder="130" className="input-style" /></FormField>
        <FormField label="Kapı Sayısı"><input name="kapiSayisi" value={formData.kapiSayisi ?? ''} onChange={handleChange} type="number" placeholder="4" className="input-style" /></FormField>
        <FormField label="Koltuk Sayısı"><input name="koltukSayisi" value={formData.koltukSayisi ?? ''} onChange={handleChange} type="number" placeholder="5" className="input-style" /></FormField>
        <FormField label="Bagaj Sayısı"><input name="bagajSayisi" value={formData.bagajSayisi} onChange={handleChange} type="number" placeholder="2" className="input-style" /></FormField>
        <FormField label="Araç Kategorisi *">
          <select name="category" value={formData.category} onChange={handleChange} className="input-style">
            {Object.values(CarCategory).map(v => <option key={v} value={v}>{v.replace('_', ' ')}</option>)}
          </select>
        </FormField>
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
        <FormField label="Standart Günlük Fiyat (₺) *">
          <input name="basePrice" value={formData.basePrice} onChange={handleChange} type="number" step="0.01" placeholder="1500" required className="input-style" />
        </FormField>
        {/* FİYAT ARALIKLARI BÖLÜMÜ */}
        <div className="col-span-full border-t border-gray-700 pt-6">
          <h3 className="text-xl font-bold mb-4 text-white">Fiyat Aralıkları</h3>
          <div className="space-y-4">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 items-center">
                <div className="col-span-2"><FormField label="Min. Gün"><input type="number" value={tier.minDays} onChange={(e) => handleTierChange(index, 'minDays', e.target.value)} required className="input-style" /></FormField></div>
                <div className="col-span-2"><FormField label="Max. Gün"><input type="number" value={tier.maxDays} onChange={(e) => handleTierChange(index, 'maxDays', e.target.value)} required className="input-style" /></FormField></div>
                <div className="col-span-2"><FormField label="Günlük Fiyat (₺)"><input type="number" step="0.01" value={tier.dailyRate} onChange={(e) => handleTierChange(index, 'dailyRate', e.target.value)} required className="input-style" /></FormField></div>
                <div className="col-span-1 pt-5"><button type="button" onClick={() => removeTier(index)} className="w-full rounded bg-red-600 p-2 text-white hover:bg-red-700">X</button></div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addTier} className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            + Yeni Fiyat Aralığı Ekle
          </button>
        </div>
      </div>


      <button type="submit" disabled={createCar.isPending || updateCar.isPending} className="w-full rounded-md bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700 disabled:bg-gray-500">
        {isEditMode ? "Aracı Güncelle" : "Aracı Kaydet"}
      </button>
    </form>
  );
}