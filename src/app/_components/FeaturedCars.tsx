"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { type Car, type PricingTier, type Booking} from "@prisma/client";
// Hata düzeltmesi: CarCard komponentinin doğru yolu belirtildi.
import { CarCard } from "./CarCard"; 

import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

// İkonlar
const IconChevronLeft = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const IconChevronRight = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);

type CarWithDetails = Car & {
  pricingTiers: PricingTier[];
  bookings: Booking[];
};

type PropType = {
  cars: CarWithDetails[]; 
  options?: EmblaOptionsType;
};

export function FeaturedCars({ cars, options }: PropType) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, loop: cars.length > 2 },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setActiveIndex(emblaApi.selectedScrollSnap());
    
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
    <section className="bg-transparent ">
      <div className="container max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-end items-center mb-8 gap-4">
          <div className="flex gap-4">
            <button onClick={scrollPrev} disabled={prevBtnDisabled} className="...">
              <IconChevronLeft />
            </button>
            <button onClick={scrollNext} disabled={nextBtnDisabled} className="...">
              <IconChevronRight />
            </button>
          </div>
        </div>
        
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {cars.map((car, index) => (
              <div key={car.id.toString()} className="embla__slide">
                <CarCard 
                  car={car} 
                  isActive={index === activeIndex} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

