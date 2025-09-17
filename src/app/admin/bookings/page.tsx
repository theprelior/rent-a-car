// app/admin/bookings/new/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function NewBookingPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [carId, setCarId] = useState<string>("");

    // Kullanıcı bilgisini getirmek için
    const { data: user } = api.user.getById.useQuery({ id: userId! }, { enabled: !!userId });
    
    // Tarihler seçildiğinde, o tarihlerde MÜSAİT olan araçları getirmek için
    const { data: availableCars, isLoading: isLoadingCars } = api.car.getAll.useQuery(
        { 
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        },
        { enabled: !!startDate && !!endDate } // Sadece tarihler seçildiğinde bu sorguyu çalıştır
    );
    
    const createBooking = api.booking.createByAdmin.useMutation({
        onSuccess: () => {
            alert("Rezervasyon başarıyla oluşturuldu!");
        },
        onError: (err) => {
            alert("Hata: " + err.message);
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !carId || !startDate || !endDate) {
            alert("Lütfen tüm alanları doldurun.");
            return;
        }
        createBooking.mutate({
            userId,
            carId: BigInt(carId),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
        });
    };

    if (!userId) return <div className="text-white">Kullanıcı ID'si bulunamadı. Lütfen kullanıcılar sayfasından tekrar deneyin.</div>
    if (!user) return <div className="text-white">Kullanıcı bilgileri yükleniyor...</div>
    
    return (
        <div className="rounded-lg bg-gray-800 p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">Yeni Rezervasyon Oluştur</h1>
            <p className="text-gray-400 mb-6">Kullanıcı: <span className="font-semibold text-white">{user.email}</span></p>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Başlangıç Tarihi</label>
                    <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} required className="input-style"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Bitiş Tarihi</label>
                    <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} required className="input-style"/>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Araç Seçimi</label>
                    <select value={carId} onChange={e => setCarId(e.target.value)} required className="input-style" disabled={!startDate || !endDate || isLoadingCars}>
                        <option value="" disabled>Önce tarih seçiniz</option>
                        {isLoadingCars && <option>Müsait araçlar yükleniyor...</option>}
                        {availableCars?.map(car => (
                            <option key={car.id} value={car.id.toString()}>{car.marka} {car.model} ({car.yil})</option>
                        ))}
                    </select>
                </div>
                <button type="submit" disabled={createBooking.isPending} className="w-full rounded-md bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 disabled:bg-gray-500">
                    {createBooking.isPending ? "Oluşturuluyor..." : "Rezervasyonu Oluştur"}
                </button>
            </form>
        </div>
    );
}