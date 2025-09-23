import { type Car } from "@prisma/client";

type StructuredDataProps = {
  car: Car;
};

// Bu bileşen, Google'a sayfanın bir ürün (araç) hakkında olduğunu söyler
export function CarStructuredData({ car }: StructuredDataProps) {
  const carJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${car.marka} ${car.model}`,
    image: car.imageUrl ?? `${process.env.NEXTAUTH_URL}/car-placeholder.png`,
    description: `${car.yil} model, ${car.yakitTuru} yakıtlı, ${car.vitesTuru.replace('_', ' ')} vitesli kiralık araç.`,
    brand: {
      '@type': 'Brand',
      name: car.marka,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TRY',
      price: Number(car.basePrice), // Standart günlük fiyatı
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'RENTORA Rent a Car',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
    />
  );
}
