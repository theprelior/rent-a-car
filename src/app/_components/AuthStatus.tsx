// app/_components/AuthStatus.tsx

"use client"; // BU ÇOK ÖNEMLİ! Bu bileşenin bir Client Component olduğunu belirtir.

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function AuthStatus() {
  const { data: session, status } = useSession();

  // Oturum bilgisi yükleniyorsa
  if (status === "loading") {
    return <p>Yükleniyor...</p>;
  }

  // Kullanıcı giriş yapmışsa
  if (status === "authenticated") {
    return (
      <div>
        <p className="mb-4">
          Hoş geldin, <span className="font-bold">{session.user?.email}</span>!
        </p>
        <button
          onClick={() => void signOut()}
          className="rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
        >
          Çıkış Yap
        </button>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa
  return (
    <div>
      <p className="mb-4">Admin paneline erişmek için lütfen giriş yapın.</p>
      <Link
        href="/login"
        className="rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        Giriş Sayfasına Git
      </Link>
    </div>
  );
}