import { type MetadataRoute } from 'next';

// Domain adınızı buraya yazın
const URL = 'https://www.rentoracar.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Tüm botlar için geçerli
      allow: '/',      // Sitenin tamamını taramaya izin ver
      disallow: '/admin/', // Admin panelini tarama (güvenlik için iyi bir pratik)
    },
    sitemap: `${URL}/sitemap.xml`, // Site haritamızın adresi
  };
}
