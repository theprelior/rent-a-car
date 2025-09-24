// app/cars/[id]/CarDetailView.tsx
"use client";

import Image from "next/image";
import { type Car, type Location } from "@prisma/client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useSearchParams } from "next/navigation";
import { toDatetimeLocal } from "~/utils/date"; // 1. Yardımcı fonksiyonu import et
import { useRouter } from "next/navigation";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

// --- lucide-react ikonları ---
import { Fuel, Users, Briefcase, Settings } from "lucide-react";

// Sunucudan gelen tip
export type CarWithDetails = Omit<
    Car,
    "id" | "motorHacmi" | "basePrice" | "pricingTiers" | "locationId"
> & {
    id: string;
    motorHacmi: string | null;
    basePrice: string;
    locationId: string | null;
    location: Location | null;
    pricingTiers: {
        id: number;
        minDays: string;
        maxDays: string;
        dailyRate: string;
        carId: string;
    }[];
};

export function CarDetailView({
    car,
    locations,
}: {
    car: CarWithDetails;
    locations: Location[];
}) {
    const { data: session } = useSession();
    const { data: extras, isLoading: isLoadingExtras } =
        api.extra.getAllPublic.useQuery();
    const searchParams = useSearchParams();
    const now = new Date();
    const [startDate, setStartDate] = useState<string>(
        searchParams.get("startDate") ?? toDatetimeLocal(new Date())
    );
    const [endDate, setEndDate] = useState<string>(
        searchParams.get("endDate") ?? toDatetimeLocal(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)) // +24 saat sonrası
    );
    const [rentalDays, setRentalDays] = useState(0);
    const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
    const [calculatedPrice, setCalculatedPrice] = useState({
        dailyRate: 0,
        carTotal: 0,
        extrasTotal: 0,
        total: 0,
    });

    // --- YENİ: Sürücü Bilgileri için State'ler ---
    const [driverName, setDriverName] = useState(session?.user.name ?? '');
    const [driverEmail, setDriverEmail] = useState(session?.user.email ?? '');
    const [driverPhone, setDriverPhone] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [flightNotes, setFlightNotes] = useState('');
    const [specialNotes, setSpecialNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const router = useRouter();
    const { showAlert } = useAlert(); // Hook'u çağır

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end > start) {
                const diffTime = end.getTime() - start.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                // DÜZELTME 1: Aynı gün kiralama için gün sayısını 1 yap
                // Math.ceil() zaten bunu yapar ama 0'dan küçük olmasını engellemek için Math.max kullanmak daha güvenli.
                const days = Math.max(1, Math.ceil(diffDays));
                setRentalDays(days);

                const tier = car.pricingTiers.find(
                    (t) => days >= Number(t.minDays) && days <= Number(t.maxDays)
                );
                const dailyRate = tier ? Number(tier.dailyRate) : Number(car.basePrice);
                const carTotal = dailyRate * days;

                const extrasTotal = selectedExtras.reduce((total, extraId) => {
                    const extra = extras?.find((e) => e.id === extraId);
                    if (!extra) return total;
                    const extraPrice = extra.isDaily
                        ? Number(extra.price) * days
                        : Number(extra.price);
                    return total + extraPrice;
                }, 0);

                setCalculatedPrice({
                    dailyRate,
                    carTotal,
                    extrasTotal,
                    total: carTotal + extrasTotal,
                });
            } else {
                setRentalDays(0);
                setCalculatedPrice({
                    dailyRate: 0,
                    carTotal: 0,
                    extrasTotal: 0,
                    total: 0,
                });
            }
        }
    }, [startDate, endDate, selectedExtras, car, extras]);

    const handleExtraChange = (extraId: number) => {
        setSelectedExtras((prev) =>
            prev.includes(extraId)
                ? prev.filter((id) => id !== extraId)
                : [...prev, extraId]
        );
    };

    const handleBookingSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
            showAlert("Bitiş tarihi ve saati, başlangıç tarih ve saatinden sonra olmalıdır.");
            return;
        }
        if (!dateOfBirth) {
            showAlert("Lütfen doğum tarihinizi girin.");
            return;
        }
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            showAlert("Rezervasyon yapmak için en az 18 yaşında olmalısınız.");
            return;
        }
        if (!paymentMethod) {
            showAlert("Lütfen bir ödeme yöntemi seçin.");
            return;
        }

        // 1. Şirketin WhatsApp numarasını buraya yaz (uluslararası formatta, + olmadan)
        const companyPhoneNumber = "5444798594"; // Örnek numara, kendi numaranla değiştir.

        // 2. Formdaki tüm verileri topla ve düzenli bir metin oluştur
        const selectedExtrasText = extras
            ?.filter(extra => selectedExtras.includes(extra.id))
            .map(extra => `- ${extra.name} (₺${Number(extra.price)} ${extra.isDaily ? '/ Günlük' : '/ Tek Seferlik'})`)
            .join('\n') || 'Ekstra seçilmedi.';

        const message = `
            *Yeni Araç Kiralama Talebi*

            *Araç Bilgileri:*
            - Araç: *${car.marka} ${car.model} (${car.yil})*
            - Teslim Alış Lokasyonu: *${locations.find(l => l.id.toString() === car.locationId)?.name ?? 'Belirtilmedi'}*
            - Alış Tarihi: *${new Date(startDate).toLocaleString('tr-TR')}*
            - Bırakış Tarihi: *${new Date(endDate).toLocaleString('tr-TR')}*
            - Toplam Gün: *${rentalDays}*

            *Sürücü Bilgileri:*
            - Ad Soyad: *${driverName}*
            - Doğum Tarihi: *${dateOfBirth}*
            - E-posta: *${driverEmail}*
            - Telefon: *${driverPhone}*

            *Ekstralar:*
            ${selectedExtrasText}

            *Notlar:*
            - Uçuş Bilgileri: *${flightNotes || 'Belirtilmedi'}*
            - Özel Notlar: *${specialNotes || 'Belirtilmedi'}*

            *Ödeme Bilgileri:*
            - Seçilen Yöntem: *${paymentMethod === 'havale' ? 'Havale / EFT' : 'Araç Teslimatında Ödeme'}*
            - Günlük Araç Ücreti: *₺${calculatedPrice.dailyRate.toLocaleString('tr-TR')}*
            - Ekstralar Toplamı: *₺${calculatedPrice.extrasTotal.toLocaleString('tr-TR')}*
            - *TOPLAM ÜCRET: ₺${calculatedPrice.total.toLocaleString('tr-TR')}*
                `;

        // 3. Mesajı URL formatına uygun hale getir
        const encodedMessage = encodeURIComponent(message.trim());

        // 4. WhatsApp linkini oluştur ve yeni sekmede aç
        const whatsappUrl = `https://wa.me/${companyPhoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');

        // İsteğe bağlı: Kullanıcıyı bir "Teşekkürler" sayfasına yönlendirebilirsin
        showAlert("Rezervasyon isteginiz iletilmistir. Tesekkurler.")
        router.push('/');
    };
    // YENİ: Doğum tarihi input'u için maksimum seçilebilir tarihi belirle
    // (Bugünden 18 yıl öncesi)
    const maxDateOfBirth = new Date();
    maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 18);
    const maxDobString = maxDateOfBirth.toISOString().split("T")[0];
    const nowAsInputMin = toDatetimeLocal(new Date());



    return (
        <div className="bg-black text-white min-h-screen pt-16">
            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Araç Bilgisi */}
                <div className="border-b-2 border-yellow-500/50 pb-4 mb-8">
                    <h1 className="text-4xl font-extrabold text-white flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <span>
                            {car.marka} {car.model}
                        </span>
                        <div className="flex items-center space-x-6 text-sm font-normal text-gray-300 mt-2 sm:mt-0">
                            {/* DEĞİŞİKLİK: İkonların boyutları responsive yapıldı */}
                            <span className="flex items-center gap-2">
                                <Fuel className="h-6 w-6 text-yellow-400 sm:h-8 sm:w-8" /> {car.yakitTuru}
                            </span>
                            <span className="flex items-center gap-2">
                                <Settings className="h-6 w-6 text-yellow-400 sm:h-8 sm:w-8" /> {car.vitesTuru.replace("_", " ")}
                            </span>
                            <span className="flex items-center gap-2">
                                <Users className="h-6 w-6 text-yellow-400 sm:h-8 sm:w-8" /> {car.koltukSayisi} Koltuk
                            </span>
                            <span className="flex items-center gap-2">
                                <Briefcase className="h-6 w-6 text-yellow-400 sm:h-8 sm:w-8" /> {car.bagajSayisi ?? "N/A"} Bagaj
                            </span>
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
                                    <input
                                        type="datetime-local"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        min={toDatetimeLocal(now)}
                                        className="input-style bg-neutral-700 [color-scheme:dark]"
                                        required
                                    />                        </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-400">Bırakış Yeri</label>
                                    <select defaultValue={car.location?.id} className="input-style mt-1 bg-neutral-700 border-neutral-700">
                                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-400">Bırakış Tarihi</label>
                                    <input
                                        type="datetime-local"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate ? toDatetimeLocal(new Date(startDate)) : toDatetimeLocal(now)}
                                        className="input-style bg-neutral-700 [color-scheme:dark]"
                                        required
                                    />                      </div>
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
                        <h2 className="text-2xl font-bold mb-4 border-b border-neutral-700 pb-2">
                            Rezervasyon Ekstraları
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {isLoadingExtras && <p>Ekstralar yükleniyor...</p>}
                            {extras?.map((extra) => (
                                <label
                                    key={extra.id}
                                    className="flex items-center space-x-3 p-3 rounded-md bg-neutral-700/50 hover:bg-neutral-700 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        onChange={() => handleExtraChange(extra.id)}
                                        className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-yellow-500 focus:ring-yellow-600"
                                    />
                                    <span className="text-gray-200">
                                        {extra.name}
                                        <span className="text-gray-400 text-sm">
                                            {" "}
                                            (₺{Number(extra.price)}{" "}
                                            {extra.isDaily ? "/ Günlük" : "/ Tek Seferlik"})
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sürücü Bilgileri */}
                    <div className="rounded-lg bg-neutral-800 p-6">
                        <h2 className="text-2xl font-bold mb-4 border-b border-neutral-700 pb-2">
                            Sürücü Bilgileri
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Ad Soyad */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-400 mb-1">
                                    Adınız Soyadınız *
                                </label>
                                <input
                                    type="text"
                                    value={driverName}
                                    onChange={(e) => setDriverName(e.target.value)}
                                    required
                                    className="input-style bg-neutral-700"
                                />
                            </div>

                            {/* Doğum Tarihi */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-400 mb-1">
                                    Doğum Tarihiniz *
                                </label>
                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    max={maxDobString} // Gelecekte bir tarih veya 18 yaşından küçük olmasını engeller
                                    onChange={(e) => setDateOfBirth(e.target.value)}
                                    required
                                    className="input-style bg-neutral-700 [color-scheme:dark]"
                                />
                            </div>

                            {/* E-posta */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-400 mb-1">
                                    E-posta Adresiniz *
                                </label>
                                <input
                                    type="email"
                                    value={driverEmail}
                                    onChange={(e) => setDriverEmail(e.target.value)}
                                    required
                                    className="input-style bg-neutral-700"
                                />
                            </div>

                            {/* Cep Telefonu */}
                            <div className="flex flex-col">
                                <label className="text-sm font-semibold text-gray-400 mb-1">
                                    Cep Telefonunuz *
                                </label>
                                <input
                                    type="tel"
                                    value={driverPhone}
                                    onChange={(e) => setDriverPhone(e.target.value)}
                                    required
                                    className="input-style bg-neutral-700"
                                />
                            </div>

                            {/* Uçuş Notları */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="text-sm font-semibold text-gray-400 mb-1">
                                    Uçuş Bilgileri (Opsiyonel)
                                </label>
                                <textarea
                                    value={flightNotes}
                                    onChange={(e) => setFlightNotes(e.target.value)}
                                    rows={2}
                                    className="input-style bg-neutral-700"
                                ></textarea>
                            </div>

                            {/* Özel Notlar */}
                            <div className="flex flex-col md:col-span-2">
                                <label className="text-sm font-semibold text-gray-400 mb-1">
                                    Özel Notlarınız (Opsiyonel)
                                </label>
                                <textarea
                                    value={specialNotes}
                                    onChange={(e) => setSpecialNotes(e.target.value)}
                                    rows={3}
                                    className="input-style bg-neutral-700"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-lg bg-neutral-800 p-6">
                        <h2 className="text-2xl font-bold mb-4 border-b border-neutral-700 pb-2">
                            Ödeme Seçenekleri
                        </h2>
                        <div className="space-y-4">
                            <p className="text-gray-400">Ödemenizi nasıl yapmak istersiniz? Seçiminiz operasyon ekibimize iletilecektir.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Seçenek 1 */}
                                <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'havale' ? 'bg-yellow-500/20 border-yellow-500' : 'border-neutral-700 hover:border-neutral-600'}`}>
                                    <input type="radio" name="paymentMethod" value="havale" checked={paymentMethod === 'havale'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                    <span className="text-lg font-bold text-white">Havale / EFT</span>
                                    <p className="text-sm text-gray-400">Rezervasyon sonrası size iletilecek IBAN numarasına ödeme yapabilirsiniz.</p>
                                </label>
                                {/* Seçenek 2 */}
                                <label className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === 'teslimde' ? 'bg-yellow-500/20 border-yellow-500' : 'border-neutral-700 hover:border-neutral-600'}`}>
                                    <input type="radio" name="paymentMethod" value="teslimde" checked={paymentMethod === 'teslimde'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                    <span className="text-lg font-bold text-white">Araç Teslimatında Ödeme</span>
                                    <p className="text-sm text-gray-400">Ödemeyi aracı teslim alırken kredi kartı veya nakit olarak yapabilirsiniz.</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Onay ve Gönder */}
                    <div className="text-center">
                        <div className="mb-4">
                            <label className="flex items-center justify-center gap-2 cursor-pointer text-gray-400">
                                <input
                                    type="checkbox"
                                    required
                                    defaultChecked
                                    className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-yellow-500 focus:ring-yellow-600"
                                />
                                Kiralama şartlarını okudum ve kabul ediyorum.
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full max-w-md rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 py-4 text-xl font-bold text-black shadow-lg transition-transform hover:scale-105"
                        >
                            Rezervasyonu Tamamla
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}