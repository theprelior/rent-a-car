// app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false, // Yönlendirmeyi biz yapacağız
      email,
      password,
    });
    if (result?.ok) {
      router.push("/profil"); // Başarılı girişte kullanıcıyı profil sayfasına yönlendir
    } else {
      setError("E-posta veya şifre hatalı.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
      <div className="w-full max-w-xs rounded-lg bg-gray-900 p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Üye Girişi</h1>
        <form onSubmit={handleSubmit}>
          {/* ... E-posta ve Şifre input'ları ... */}
          <div className="mb-4">
              <label className="mb-2 block text-sm font-bold" htmlFor="email">E-posta</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input-style" />
          </div>
          <div className="mb-6">
              <label className="mb-2 block text-sm font-bold" htmlFor="password">Şifre</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="input-style" />
          </div>
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
          <button type="submit" className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">Giriş Yap</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
            Hesabın yok mu?{" "}
            <Link href="/auth/register" className="font-bold text-blue-400 hover:underline">Kayıt Ol</Link>
        </p>
      </div>
    </main>
  );
}