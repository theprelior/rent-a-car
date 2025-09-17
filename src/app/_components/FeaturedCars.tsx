// app/_components/FeaturedCars.tsx

"use client";

import React, { useCallback, useEffect, useState } from 'react'
import { type Car } from "@prisma/client";
import { CarCard, type PlainCar } from "./CarCard";
import useEmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

// Ok ikonları
const IconChevronLeft = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg> );
const IconChevronRight = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg> );

type PropType = {
  cars: Car[];
  options?: EmblaOptionsType;
};

export function FeaturedCars({ cars, options }: PropType) {
  // Embla Carousel hook'unu otomatik oynatma eklentisiyle birlikte başlatıyoruz
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, loop: true }, 
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );
  
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  // Geri ve ileri gitme fonksiyonları
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Butonların aktif/pasif durumunu kontrol etmek için
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, []);

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect]);

  return (
<section className="bg-transparent py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            
          </div>
          {/* Navigasyon Okları */}
          <div className="hidden md:flex gap-4">
              <button onClick={scrollPrev} disabled={prevBtnDisabled} className="rounded-full p-2 bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                  <IconChevronLeft />
              </button>
              <button onClick={scrollNext} disabled={nextBtnDisabled} className="rounded-full p-2 bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50">
                  <IconChevronRight />
              </button>
          </div>
        </div>
        
        {/* Embla Carousel Viewport */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {cars.map((car) => {
              const plainCar: PlainCar = {
                ...car,
                id: car.id.toString(),
                fiyat: car.fiyat?.toString() ?? null,
                motorHacmi: car.motorHacmi?.toString() ?? null,
              };
              return (
                <div key={car.id} className="embla__slide p-4">
                    <CarCard car={plainCar} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}