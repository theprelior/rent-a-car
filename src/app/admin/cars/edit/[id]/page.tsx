// app/admin/cars/edit/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { AddCarForm } from "~/app/_components/AddCarForm";

// Kendi tip tanımımızı (EditCarPageProps) kaldırdık.
// Tipi doğrudan fonksiyonun içinde belirtiyoruz.
export default async function EditCarPage({ params }: { params: { id: string } }) {
  let carId: bigint;
  try {
    carId = BigInt(params.id);
  } catch (error) {
    return notFound();
  }

  const car = await api.car.getById({ id: carId });

  if (!car) {
    return notFound();
  }

  // Sunucudan İstemciye gönderilecek veri için "plain" obje oluşturuyoruz
  const plainCar = {
    ...car,
    id: car.id.toString(),
    motorHacmi: car.motorHacmi?.toString() ?? null,
    basePrice: car.basePrice.toString(),
    pricingTiers: car.pricingTiers.map(tier => ({
      ...tier,
      minDays: tier.minDays.toString(),
      maxDays: tier.maxDays.toString(),
      dailyRate: Number(tier.dailyRate).toString(),
      carId: tier.carId.toString(),
    })),
  };

  return (
    <div>
      <AddCarForm initialData={plainCar} />
    </div>
  );
}