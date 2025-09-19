"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import Link from 'next/link';

// Bu bileşen, eski page.tsx'in tüm içeriğini barındırır.
export function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { mutate, isPending, isSuccess, isError, error } = api.user.verifyEmail.useMutation({
    onSuccess: () => {
      setTimeout(() => {
        router.push('/'); 
      }, 3000);
    },
  });

  useEffect(() => {
    if (token && !isSuccess) {
      mutate({ token });
    }
  }, [token, mutate, isSuccess]);

  const renderContent = () => {
    if (isPending || !token) {
      return <p className="text-xl text-gray-300">Doğrulanıyor, lütfen bekleyin...</p>;
    }
    if (isError) {
      return (
        <>
          <h1 className="text-3xl font-bold text-red-500">Doğrulama Başarısız</h1>
          <p className="mt-4 text-lg text-gray-300">{error.message}</p>
        </>
      );
    }
    if (isSuccess) {
      return (
        <>
          <h1 className="text-3xl font-bold text-green-500">E-posta Başarıyla Doğrulandı!</h1>
          <p className="mt-4 text-lg text-gray-300">
            Birkaç saniye içinde ana sayfaya yönlendirileceksiniz.
          </p>
          <Link href="/" className="mt-4 text-yellow-400 hover:underline">Şimdi Ana Sayfaya Dön</Link>
        </>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-neutral-900 p-8 text-center shadow-lg">
      {renderContent()}
    </div>
  );
}