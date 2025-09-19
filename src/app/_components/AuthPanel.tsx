"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { LoginForm, RegisterForm } from "./AuthForm";

type AuthPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
};

export function AuthPanel({ isOpen, onClose, initialMode }: AuthPanelProps) {
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Arka Plan Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Panel İçeriği */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-neutral-900 px-4 py-6 shadow-xl sm:px-6">
                    <div className="flex items-start justify-end">
                       <button type="button" className="text-gray-400 hover:text-white" onClick={onClose}>
                          <span className="sr-only">Paneli kapat</span>
                          {/* IconX SVG'sini buraya koyabiliriz veya basit bir X harfi */}
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {mode === 'login' ? (
                        <LoginForm onSwitchMode={setMode} onSuccess={onClose} />
                      ) : (
                        <RegisterForm onSwitchMode={setMode} onSuccess={onClose} />
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}