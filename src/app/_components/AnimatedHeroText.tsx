// app/_components/AnimatedHeroText.tsx

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// YENİ: Daha şık bir tekerlek için özel SVG ikonu
const IconWheel = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="currentColor"
    strokeWidth="6"
  >
    <circle cx="50" cy="50" r="45" />
    <circle cx="50" cy="50" r="12" />
    <line x1="50" y1="15" x2="50" y2="38" />
    <line x1="50" y1="62" x2="50" y2="85" />
    <line x1="80.31" y1="34.5" x2="62.5" y2="43.25" />
    <line x1="37.5" y1="56.75" x2="19.69" y2="65.5" />
    <line x1="19.69" y1="34.5" x2="37.5" y2="43.25" />
    <line x1="62.5" y1="56.75" x2="80.31" y2="65.5" />
  </svg>
);


export function AnimatedHeroText() {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationStage(1);
    }, 500);

    const timer2 = setTimeout(() => {
      setAnimationStage(2);
    }, 4000); // RENTORA yazısı 3.5 saniye ekranda kalacak

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative flex h-48 w-full flex-col items-center justify-center text-center">

      {/* Aşama 1: RENTORA animasyonu */}
      <motion.div
        // DÜZELTME: `items-center` ile dikey hizalamayı sağlıyoruz
        className="absolute flex items-center space-x-1 text-6xl font-extrabold text-white md:text-8xl"
        variants={container}
        initial="hidden"
        animate={animationStage === 1 ? "visible" : "hidden"}
      >
        {"RENTORA".split("").map((char, i) => (
          <motion.span key={i} variants={letter}>
            {char === "O" ? (
              <motion.span
                // DÜZELTME: Tekerleği dikeyde diğer harflerle hizalamak için
                // relative ve top-1 (veya md:top-2) class'larını ekliyoruz.
                className="relative top-1 inline-block md:top-2"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <IconWheel className="h-16 w-16 text-yellow-500 md:h-19 md:w-19" />
              </motion.span>
            ) : (
              // Harflerin dikeyde hizalanması için bir kapsayıcı
              <span className="pt-2">{char}</span>
            )}
          </motion.span>
        ))}
      </motion.div>

      {/* Aşama 2: Yola Çık */}
      <motion.div
        className="absolute text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: animationStage === 2 ? 1 : 0 }}
        transition={{ duration: 1.0 }}
      >
        <h1 className="text-5xl font-extrabold tracking-tighter text-white md:text-8xl">
          Yola Çık,{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent inline-block px-1 leading-normal">
            Yol Açık
          </span>
        </h1>
      </motion.div>
    </div>
  );
}