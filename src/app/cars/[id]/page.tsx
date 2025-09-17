// app/cars/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { CarDetailView } from "./CarDetailView"; // Yeni bileşenimizi import ediyoruz

type CarDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  // URL'den gelen ID string olduğu için onu Prisma'nın beklediği BigInt tipine çeviriyoruz
  let carId: bigint;
  try {
    carId = BigInt(params.id);
  } catch (error) {
    // Eğer ID geçerli bir sayı değilse, 404 sayfasına yönlendir
    return notFound();
  }

  const car = await api.car.getById({ id: carId });
  const locations = await api.location.getAll();
  if (!car) {
    return notFound();
  }

  // Decimal objelerini string'e çevirerek "plain" bir obje oluşturuyoruz
  const plainCar = {
      ...car,
      id: car.id.toString(),
      fiyat: car.fiyat?.toString() ?? null,
      motorHacmi: car.motorHacmi?.toString() ?? null,
  };

  return <CarDetailView car={plainCar} locations={locations} />;
}