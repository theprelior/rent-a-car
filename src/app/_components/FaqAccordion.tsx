// app/_components/FaqAccordion.tsx

"use client"; // Tıklama ve durum yönetimi için Client Component olmalı

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

// Chevron ikonu
const IconChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    // Tıklanan soru zaten açıksa kapat, değilse aç
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {items.map((item, index) => (
        <div key={index} className="border-b border-gray-700">
          <button
            onClick={() => handleToggle(index)}
            className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-white"
          >
            <span>{item.question}</span>
            <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
              <IconChevronDown />
            </span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              openIndex === index ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            <div className="pb-5 pr-4 text-gray-300">
              <p>{item.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}