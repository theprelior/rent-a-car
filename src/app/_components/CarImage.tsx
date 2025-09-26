"use client"; // ✅ bu component artık client

import Image, { type ImageLoaderProps } from "next/image";

export default function CarImage({ src, alt }: { src: string; alt: string }) {
  const loader = ({ src, width, quality }: ImageLoaderProps) => {
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
    return `${APP_URL}${normalizedSrc}?w=${width}&q=${quality ?? 75}`;
  };

  return (
    <Image
      loader={loader}
      src={src}
      alt={alt}
      fill
      className="object-fill"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      quality={80}
    />
  );
}
