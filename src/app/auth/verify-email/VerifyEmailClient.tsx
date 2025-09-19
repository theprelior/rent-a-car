// app/auth/verify-email/VerifyEmailClient.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import Link from "next/link";

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isPending, isSuccess, isError, error } =
    api.user.verifyEmail.useMutation({
      onSuccess: () => {
        setTimeout(() => router.push("/"), 3000);
      },
    });

  useEffect(() => {
    if (token && !isSuccess) {
      mutate({ token });
    }
  }, [token, mutate, isSuccess]);

  if (!token || isPending) return <p className="text-xl">Doğrulanıyor...</p>;
  if (isError)
    return (
      <>
        <h1 className="text-3xl font-bold text-red-500">Doğrulama Başarısız</h1>
        <p className="mt-4 text-lg text-gray-300">{error.message}</p>
      </>
    );
  if (isSuccess)
    return (
      <>
        <h1 className="text-3xl font-bold text-green-500">E-posta Başarıyla Doğrulandı!</h1>
        <p className="mt-4 text-lg text-gray-300">
          3 saniye içinde giriş sayfasına yönlendirileceksiniz.
        </p>
        <Link href="/" className="mt-4 text-yellow-400 hover:underline">
          Şimdi Giriş Yap
        </Link>
      </>
    );

  return null;
}
