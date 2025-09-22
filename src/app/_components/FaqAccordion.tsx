"use client";

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-4">
        {items.map((item, index) => (
          <Disclosure key={index} as="div" className="rounded-xl bg-neutral-900 border border-neutral-800">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex w-full items-center justify-between p-6 text-left text-lg font-medium text-white focus:outline-none focus-visible:ring focus-visible:ring-yellow-500/75">
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-6 w-6 text-yellow-400 transition-transform duration-300`}
                  />
                </Disclosure.Button>
                
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-6 pb-6 text-base text-gray-400 border-t border-neutral-800 pt-4">
                    {item.answer}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
}