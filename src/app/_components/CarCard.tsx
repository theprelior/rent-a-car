
import Image, { type ImageLoaderProps } from "next/image";
import Link from "next/link";
import { type Car, type PricingTier, type Booking } from "@prisma/client";
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

// Tip tanımını güncelliyoruz
type CarWithDetails = Car & {
  pricingTiers: PricingTier[];
  bookings: Booking[];
  previewVideoUrl?: string | null; // <-- BU SATIRI EKLEYİN
};


// --- YENİ ADIM 1: Mobil cihaz tespiti için bir custom hook oluşturuyoruz ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Bu kod sadece tarayıcıda çalışır, sunucu tarafında çalışmaz
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleResize = () => setIsMobile(mediaQuery.matches);

    handleResize(); // İlk yüklemede kontrol et
    window.addEventListener("resize", handleResize); // Ekran boyutu değiştikçe dinle

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const customImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
  // Next.js'in beklediği 'width' ve 'quality' parametrelerini alıyoruz
  // ama bizim basit senaryomuzda sadece 'src' kullanmamız yeterli.
  return `${APP_URL}${src}`;
};
type CarWithPreview = Car & { previewVideoUrl?: string | null };

export function CarCard({ car, isActive = false }: { car: CarWithDetails, isActive?: boolean }) {
  // En düşük günlük fiyatı bulmak için bir mantık ekleyelim
  // Bu, "Fiyatlar ...'dan başlıyor" demek için kullanılır.
  const startingPrice = car.pricingTiers.reduce((min, tier) => {
    const rate = Number(tier.dailyRate);
    return rate < min ? rate : min;
  }, Number(car.basePrice)); // Başlangıç olarak basePrice'ı al
  const isCurrentlyBooked = car.bookings && car.bookings.length > 0;
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile(); // Cihazın mobil olup olmadığını öğreniyoruz

  const { ref, inView } = useInView({
    threshold: 0.3, // kartın %30'u görünürse aktif olur
    triggerOnce: false,
  });


    const shouldPlayVideo = (isHovered || (isMobile && isActive)) && inView;

  useEffect(() => {
    if (videoRef.current) {
      if (shouldPlayVideo) {
        videoRef.current.play().catch(error => console.error("Video Oynatılamadı:", error));
      } else {
        videoRef.current.pause();
      }
    }
  }, [shouldPlayVideo]); // Bu efekt, oynatma durumu değiştiğinde çalışacak

  return (

    <div ref={ref}
      className="flex h-full flex-col overflow-hidden rounded-xl bg-neutral-900 shadow-lg transition-transform duration-300 hover:scale-105 border border-neutral-800 group will-change-transform will-change-opacity"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/cars/${car.id.toString()}`} className="block">
        <div className="relative w-full aspect-[4/3] bg-neutral-800"> {/* bg-black yerine bg-neutral-800 */}
          {/* Ana Resim (her zaman altta durur) */}
          <Image
            // --- YENİ ADIM 2: 'loader' prop'unu doğrudan ekliyoruz ---
            loader={customImageLoader}
            // src'den ortam değişkenini kaldırıyoruz, loader bunu halledecek.
            src={car.imageUrl ? car.imageUrl : '/placeholder.png'}
            alt={`${car.marka} ${car.model}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />


          {/* Önizleme Videosu sadece görünüyorsa render edilir */}
          {inView && car.previewVideoUrl && (
            <video
              key={car.id}
              src={`${process.env.NEXT_PUBLIC_APP_URL}${car.previewVideoUrl}`}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                }`}
            />
          )}
          {/* YENİ: "Kullanımda" şeridi */}
          {isCurrentlyBooked && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500%] bg-red-600/90 transform -rotate-30 flex items-center justify-center py-3">
                  <span className="text-white font-bold text-lg tracking-widest">
                    Kullanımda
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-white">{car.marka} {car.model}</h3>
        <p className="text-sm text-gray-400">{car.yil}</p>
        <div className="mt-4 flex-grow">
          {/* Özellikler */}
        </div>
        <div className="mt-4 border-t border-neutral-700 pt-4">
          <p className="text-gray-400">Günlük Fiyat</p>
          <p className="text-2xl font-bold text-yellow-400">
            ₺{startingPrice.toLocaleString('tr-TR')}
            <span className="text-base font-normal text-gray-400">'dan başlayan fiyatlarla</span>
          </p>
        </div>
      </div>
    </div>
  );
}