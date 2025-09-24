"use client";

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAlert } from '~/context/AlertContext';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export function AlertModal() {
  const { alertState, hideAlert } = useAlert();
  const { isOpen, message, type, title } = alertState;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-400" aria-hidden="true" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" aria-hidden="true" />;
      case 'info':
      default:
        return <Info className="h-12 w-12 text-blue-400" aria-hidden="true" />;
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={hideAlert}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-neutral-900 border border-neutral-700 px-6 pb-6 pt-8 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-neutral-800 sm:mx-0 sm:h-12 sm:w-12">
                    {getIcon()}
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-white">
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-md text-gray-400">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:mt-5 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-yellow-600 sm:ml-3 sm:w-auto"
                    onClick={hideAlert}
                  >
                    Tamam
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

