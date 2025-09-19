import { Suspense } from 'react';
import { VerifyEmailContent } from './VerifyEmailContent';

// Yükleme sırasında gösterilecek olan basit bir bileşen
function LoadingFallback() {
    return (
        <div className="w-full max-w-md rounded-lg bg-neutral-900 p-8 text-center shadow-lg">
            <p className="text-xl text-gray-300">Yükleniyor...</p>
        </div>
    );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <Suspense fallback={<LoadingFallback />}>
            <VerifyEmailContent />
        </Suspense>
    </main>
  );
}