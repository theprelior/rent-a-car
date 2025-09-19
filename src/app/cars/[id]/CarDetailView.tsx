// app/cars/[id]/CarDetailView.tsx
"use client";

import Image from "next/image";
import { type Car, type Location, type PricingTier, type Extra } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

// Sunucudan gelen, serialize edilmiş ve ilişkili verileri içeren tip
export type CarWithDetails = Omit<Car, "id" | "motorHacmi" | "basePrice" | "pricingTiers" | "locationId"> & {
    id: string;
    motorHacmi: string | null;
    basePrice: string;
    locationId: string | null;
    location: Location | null; // location objesini ekliyoruz
    pricingTiers: {
        id: number;
        minDays: string; // number -> string
        maxDays: string; // number -> string
        dailyRate: string; // Decimal -> string
        carId: string; // bigint -> string
    }[];
};

// İkonlar (Aynı)
// İkonları tanımlıyoruz

const IconGas = () => (<svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="3" x2="15" y1="22" y2="22" /><line x1="4" x2="14" y1="9" y2="9" /><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" /><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" /></svg>);

const IconManualGearbox = () => (<svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6h2l4 12h2l4-12h2" /><circle cx="12" cy="6" r="4" /></svg>);

const IconUsers = () => (<svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);


export function CarDetailView({ car, locations }: { car: CarWithDetails, locations: Location[] }) {
    const { data: session } = useSession();

    // --- YENİ: Ekstraları veritabanından çekiyoruz ---
    const { data: extras, isLoading: isLoadingExtras } = api.extra.getAllPublic.useQuery();

    // State Yönetimi
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [rentalDays, setRentalDays] = useState(0);
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [calculatedPrice, setCalculatedPrice] = useState({ dailyRate: 0, carTotal: 0, extrasTotal: 0, total: 0 });

    // Fiyat Hesaplamaları
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end > start) {
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const days = diffDays > 0 ? diffDays : 0;
                setRentalDays(days);

                // Doğru fiyat aralığını bul
                const tier = car.pricingTiers.find(t =>
                    days >= Number(t.minDays) && days <= Number(t.maxDays)
                );

                const dailyRate = tier ? Number(tier.dailyRate) : Number(car.basePrice);
                const carTotal = dailyRate * days;

                // Ekstraların toplam fiyatını hesapla
                const extrasTotal = selectedExtras.reduce((total, extraId) => {
                    const extra = extras?.find(e => e.id === extraId);
                    if (!extra) return total;
                    // Ücret günlük ise gün sayısıyla çarp, değilse fiyati direkt ekle
                    const extraPrice = extra.isDaily ? Number(extra.price) * days : Number(extra.price);
                    return total + extraPrice;
                }, 0);

                setCalculatedPrice({ dailyRate, carTotal, extrasTotal, total: carTotal + extrasTotal });
            } else {
                setRentalDays(0);
                setCalculatedPrice({ dailyRate: 0, carTotal: 0, extrasTotal: 0, total: 0 });
            }
        }
    }, [startDate, endDate, selectedExtras, car, extras]);

    const handleExtraChange = (extraId: number) => {
        setSelectedExtras(prev =>
            prev.includes(extraId)
                ? prev.filter(id => id !== extraId)
                : [...prev, extraId]
        );
    };

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Kullanıcının rezervasyon oluşturma mantığı buraya gelecek.
        alert("Rezervasyon Tamamla butonuna tıklandı!");
    };
    return (
        <div className="bg-black text-white min-h-screen pt-16">
            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* BÖLÜM 1: ARAÇ BİLGİSİ VE FİYAT HESAPLAMA */}
                <div className="border-b-2 border-yellow-500/50 pb-4 mb-8">
                    <h1 className="text-4xl font-extrabold text-white flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <span>{car.marka} {car.model}</span>
                        <div className="flex items-center space-x-4 text-sm font-normal text-gray-300 mt-2 sm:mt-0">
                            <span className="flex items-center"><IconGas /> {car.yakitTuru}</span>
                            <span className="flex items-center"><IconManualGearbox /> {car.vitesTuru.replace('_', ' ')}</span>
                            <span className="flex items-center"><IconUsers /> {car.koltukSayisi} Koltuk</span>
                        </div>
                    </h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg shadow-yellow-500/10">
                            <Image src={car.imageUrl ?? '/car-placeholder.png'} alt={`${car.marka} ${car.model}`} layout="fill" objectFit="cover" />
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="rounded-lg bg-neutral-800 p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-400">Alış Yeri</label>
                                    {/* DÜZELTME: car.location artık var */}
                                    <select defaultValue={car.location?.id} className="input-style mt-1 bg-neutral-700 border-neutral-700">
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-400">Alış Tarihi</label>
                                    <input type="date" onChange={(e) => e.target.value && setStartDate(e.target.value)} className="input-style mt-1 bg-neutral-700 border-neutral-700 [color-scheme:dark]" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-400">Bırakış Yeri</label>
                                    <select defaultValue={car.location?.id} className="input-style mt-1 bg-neutral-700 border-neutral-700">
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-400">Bırakış Tarihi</label>
                                    <input type="date" onChange={(e) => e.target.value && setEndDate(e.target.value)} className="input-style mt-1 bg-neutral-700 border-neutral-700 [color-scheme:dark]" />
                                </div>
                            </div>
                            <div className="mt-6 border-t border-neutral-700 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-300"><p>Kiralama Süresi:</p> <p className="font-semibold text-white">{rentalDays} Gün</p></div>
                                <div className="flex justify-between text-gray-300"><p>Günlük Araç Ücreti:</p> <p className="font-semibold text-white">₺{calculatedPrice.dailyRate.toLocaleString('tr-TR')}</p></div>
                                <div className="flex justify-between text-gray-300"><p>Ekstralar Toplamı:</p> <p className="font-semibold text-white">₺{calculatedPrice.extrasTotal.toLocaleString('tr-TR')}</p></div>
                                <div className="flex justify-between text-2xl font-bold mt-4 border-t border-neutral-700 pt-4"><p className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">TOPLAM ÜCRET</p> <p className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">₺{calculatedPrice.total.toLocaleString('tr-TR')}</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BÖLÜM 2: REZERVASYON FORMU */}
                <form onSubmit={handleBookingSubmit} className="space-y-12">
                    {/* Rezervasyon Ekstraları Bölümü */}
                    <div className="rounded-lg bg-neutral-800 p-6">
                        <h2 className="text-2xl font-bold mb-4 border-b border-neutral-700 pb-2">Rezervasyon Ekstraları</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {isLoadingExtras && <p>Ekstralar yükleniyor...</p>}
                            {extras?.map(extra => (
                                <label key={extra.id} className="flex items-center space-x-3 p-3 rounded-md bg-neutral-700/50 hover:bg-neutral-700 cursor-pointer">
                                    <input type="checkbox" onChange={() => handleExtraChange(extra.id)} className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-yellow-500 focus:ring-yellow-600" />
                                    <span className="text-gray-200">{extra.name}
                                        <span className="text-gray-400 text-sm">
                                            (₺{Number(extra.price)} {extra.isDaily ? '/ Günlük' : '/ Tek Seferlik'})
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-neutral-800 p-6">
                        <h2 className="text-2xl font-bold mb-4 border-b border-neutral-700 pb-2">Sürücü Bilgileri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" defaultValue={session?.user.name ?? ''} placeholder="Adınız Soyadınız *" required className="input-style bg-neutral-700" />
                            <input type="email" defaultValue={session?.user.email ?? ''} placeholder="E-posta Adresiniz *" required className="input-style bg-neutral-700" />
                            <input type="tel" placeholder="Cep Telefonunuz *" required className="input-style bg-neutral-700" />
                            <textarea placeholder="Özel Notlarınız (Uçuş No vb.)" rows={1} className="input-style bg-neutral-700"></textarea>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="mb-4">
                            <label className="flex items-center justify-center gap-2 cursor-pointer text-gray-400"><input type="checkbox" required defaultChecked className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-yellow-500 focus:ring-yellow-600" /> Kiralama şartlarını okudum ve kabul ediyorum.</label>
                        </div>
                        <button type="submit" className="w-full max-w-md rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 text-xl font-bold text-black shadow-lg transition-transform hover:scale-105">
                            Rezervasyonu Tamamla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}