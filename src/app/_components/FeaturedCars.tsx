"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { type Car, type PricingTier } from "@prisma/client";
import { CarCard } from "./CarCard";

import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

// İkonlar
const IconChevronLeft = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const IconChevronRight = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);

// DÜZELTME 1: CarCard'ın da kullandığı doğru tipi burada tanımlıyoruz
type CarWithTiers = Car & {
  pricingTiers: PricingTier[];
};

// DÜZELTME 2: Prop'un tipini Car[] yerine CarWithTiers[] yapıyoruz
type PropType = {
  cars: CarWithTiers[]; 
  options?: EmblaOptionsType;
};

export function FeaturedCars({ cars, options }: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, loop: cars.length > 2 },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="bg-transparent pt-8">
      <div className="container max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-end items-center mb-8 gap-4">
          <div className="hidden md:flex gap-4">
            <button onClick={scrollPrev} disabled={prevBtnDisabled} className="rounded-full p-2 bg-neutral-800 text-white transition hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700">
              <IconChevronLeft />
            </button>
            <button onClick={scrollNext} disabled={nextBtnDisabled} className="rounded-full p-2 bg-neutral-800 text-white transition hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700">
              <IconChevronRight />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {cars.map((car) => (
              <div key={car.id.toString()} className="embla__slide">
                {/* Artık car objesi CarWithTiers tipine uyumlu */}
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}