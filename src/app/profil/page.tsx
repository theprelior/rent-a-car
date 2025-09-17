// app/profil/page.tsx

import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilPage() {
  const session = await getServerAuthSession();

  // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
  if (!session) {
    redirect("/login");
  }

  // Giriş yapmış kullanıcının rezervasyonlarını çek
  const bookings = await api.booking.getMyBookings();

  return (
    <div className="bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-16 text-white">
        <h1 className="text-4xl font-bold mb-2">Profil Sayfanız</h1>
        <p className="text-gray-400 mb-8">Hoş geldiniz, {session.user.email}</p>

        <div className="rounded-lg bg-gray-900 p-6">
          <h2 className="text-2xl font-bold mb-6">Rezervasyonlarım</h2>
          
          {bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex flex-col md:flex-row gap-6 bg-gray-800 p-4 rounded-lg">
                  <div className="relative w-full md:w-1/3 h-48 flex-shrink-0">
                     <Image
                        src={booking.car.imageUrl ?? '/car-placeholder.png'}
                        alt={`${booking.car.marka} ${booking.car.model}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold">{booking.car.marka} {booking.car.model}</h3>
                    <p className="text-gray-400">{booking.car.yil}</p>
                    <div className="mt-4 border-t border-gray-700 pt-4 text-gray-300">
                        <p><span className="font-semibold">Alış Tarihi:</span> {new Date(booking.startDate).toLocaleDateString('tr-TR')}</p>
                        <p><span className="font-semibold">Bırakış Tarihi:</span> {new Date(booking.endDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-700 rounded-lg">
                <p className="text-gray-400">Henüz aktif bir rezervasyonunuz bulunmuyor.</p>
                <Link href="/" className="mt-4 inline-block rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700">
                    Hemen Araç Kirala
                </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}