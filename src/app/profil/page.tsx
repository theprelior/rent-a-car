import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Image from "next/image";
import Link from "next/link";
import { Role } from "@prisma/client";
import { UserInfoCard } from "../_components/UserInfoCard"; // YENİ: UserInfoCard'ı import et

// İkonlar için basit bileşenler
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconMail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const IconShield = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);

export default async function ProfilPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/"); // Ana login paneline yönlendirelim
  }

  // Hem kullanıcı bilgilerini hem de rezervasyonları aynı anda çekiyoruz
  const [user, bookings] = await Promise.all([
    api.user.getMe(),
    api.booking.getMyBookings(),
  ]);

  if (!user) {
    // Bu durumun yaşanması zor ama güvenlik için kontrol edelim
    return redirect("/");
  }

  return (
     <div className="bg-black text-white min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Profilim</h1>
          <p className="mt-2 text-lg text-gray-400">Hoş geldin, <span className="text-yellow-400 font-semibold">{user.name ?? user.email}</span>!</p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          
          {/* Sol Sütun: YENİ BİLEŞENİ KULLANIYORUZ */}
          <div className="lg:col-span-1">
            <UserInfoCard user={user} />
          </div>


          {/* Sağ Sütun: Rezervasyonlarım */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-neutral-900 p-6 shadow-lg">
              <h2 className="text-2xl font-bold border-b border-neutral-700 pb-4 mb-6">Rezervasyonlarım</h2>
              {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex flex-col md:flex-row gap-6 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                      <div className="relative w-full md:w-1/3 h-48 flex-shrink-0">
                        <Image src={booking.car.imageUrl ?? '/car-placeholder.png'} alt={`${booking.car.marka} ${booking.car.model}`} layout="fill" objectFit="cover" className="rounded-md" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-yellow-400">{booking.car.marka} {booking.car.model}</h3>
                        <p className="text-gray-400">{booking.car.yil}</p>
                        <div className="mt-4 border-t border-neutral-600 pt-4 text-gray-300 space-y-2">
                          <p><span className="font-semibold text-gray-400">Alış:</span> {new Date(booking.startDate).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                          <p><span className="font-semibold text-gray-400">Bırakış:</span> {new Date(booking.endDate).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                          {/* İleride buraya rezervasyon durumu ve toplam fiyat gibi bilgiler de eklenebilir. */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-neutral-700 rounded-lg">
                  <p className="text-gray-400">Henüz bir rezervasyonunuz bulunmuyor.</p>
                  <Link href="/" className="mt-4 inline-block rounded-md bg-yellow-500 px-6 py-2 font-semibold text-black transition hover:bg-yellow-600">
                    Hemen Kirala
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}