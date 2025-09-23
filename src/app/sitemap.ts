import { type MetadataRoute } from 'next';
import { api } from '~/trpc/server';

// Domain adınızı buraya yazın
const URL = 'https://www.rentoracar.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Statik sayfalarımızı ekliyoruz
  const staticRoutes = [
    '',
    '/hakkimizda',
    '/fiyat-listesi',
    '/kosullar',
    '/sss',
    '/iletisim',
    '/araclar',
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
  }));

  // 2. Dinamik araç detay sayfalarını ekliyoruz
  const cars = await api.car.getAll();
  const carRoutes = cars.map((car) => ({
    url: `${URL}/cars/${car.id.toString()}`,
    lastModified: car.updatedAt,
  }));

  return [...staticRoutes, ...carRoutes];
}
