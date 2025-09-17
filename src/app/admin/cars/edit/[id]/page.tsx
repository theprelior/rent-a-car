// app/admin/cars/edit/[id]/page.tsx

import { notFound } from "next/navigation";
import { api } from "~/trpc/server";
import { AddCarForm } from "~/app/_components/AddCarForm";

type EditCarPageProps = {
  params: { id: string; };
};

export default async function EditCarPage({ params }: EditCarPageProps) {
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

  // Decimal objelerini string'e çevirerek "plain" bir obje oluşturuyoruz
  // Bu, Server -> Client bileşenine veri aktarımı için zorunludur
  const plainCar = {
      ...car,
      id: car.id.toString(), // BigInt -> String
      fiyat: car.fiyat?.toString() ?? null,
      motorHacmi: car.motorHacmi?.toString() ?? null,
  };

  return (
    <div>
      {/* AddCarForm'u 'initialData' prop'u ile çağırarak düzenleme modunda açıyoruz */}
      <AddCarForm initialData={plainCar} />
    </div>
  );
}