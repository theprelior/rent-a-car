// app/_components/AnimatedHeroText.tsx

"use client";

import { useState, useEffect } from "react";

export function AnimatedHeroText() {
  // Animasyonun hangi aşamada olduğunu takip etmek için bir state
  // 0: başlangıç (her şey gizli)
  // 1: karşılama metni görünür
  // 2: karşılama metni gizli, ana slogan görünür
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // Component yüklendikten kısa bir süre sonra ilk aşamayı başlat
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 500); // 0.5 saniye bekle

    // Belirli bir süre sonra ikinci aşamaya geç
    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 3000); // Toplam 3 saniye sonra (karşılama metni yaklaşık 2.5 sn görünür kalacak)

    // Component unmount olduğunda timer'ları temizle
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []); // Bu effect sadece component ilk yüklendiğinde bir kez çalışır

  return (
    <div className="max-w-4xl h-48 flex flex-col justify-center items-center"> {/* Yüksekliği sabitleyerek kaymayı önlüyoruz */}
      
      {/* Aşama 1: Karşılama Metni */}
      <div 
        className={`transition-opacity duration-1000 ${
          animationStage === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-lg text-gray-300 md:text-xl">
          Ayrıcalıklı bir sürüş deneyimine hoş geldiniz.
        </p>
      </div>
      
      {/* Aşama 2: Ana Slogan ve Marka */}
      <div 
        className={`absolute transition-opacity duration-1000 ${
            animationStage === 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-5xl font-extrabold tracking-tighter text-white md:text-8xl">
          Yola Çık, <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Yol Açık</span>
        </h1>
        <h2 className="mt-2 text-4xl font-bold tracking-widest text-gray-400 md:text-5xl">
          RENTORA
        </h2>
      </div>

    </div>
  );
}