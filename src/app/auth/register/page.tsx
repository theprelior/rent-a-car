// app/auth/register/page.tsx

"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  // GÜNCELLEME: State'i yeni alanları içerecek şekilde genişletiyoruz
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  
  const router = useRouter();

  const signupMutation = api.auth.signup.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      router.push("/auth/login");
    },
    onError: (error) => {
      alert(`Kayıt başarısız: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // İsteği göndermeden önce basit bir client-side kontrolü de ekleyebiliriz
    if (password !== passwordConfirmation) {
        alert("Şifreler uyuşmuyor!");
        return;
    }
    signupMutation.mutate({ name, lastName, email, password, passwordConfirmation });
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
      <div className="w-full max-w-sm rounded-lg bg-gray-900 p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">Üye Ol</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* GÜNCELLEME: Yeni input alanları eklendi */}
            <div className="flex gap-4">
                <div className="w-1/2">
                    <label className="mb-2 block text-sm font-bold" htmlFor="name">İsim</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" required className="input-style" />
                </div>
                <div className="w-1/2">
                    <label className="mb-2 block text-sm font-bold" htmlFor="lastName">Soyisim</label>
                    <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" required className="input-style" />
                </div>
            </div>
            <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="email">E-posta</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="input-style" />
            </div>
            <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="password">Şifre</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="input-style" />
            </div>
            <div>
                <label className="mb-2 block text-sm font-bold" htmlFor="passwordConfirmation">Şifre Tekrar</label>
                <input value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} type="password" required className="input-style" />
            </div>
          
          <button type="submit" disabled={signupMutation.isPending} className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 disabled:bg-gray-500">
            {signupMutation.isPending ? "Kaydediliyor..." : "Kayıt Ol"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
            Zaten bir hesabın var mı?{" "}
            <Link href="/auth/login" className="font-bold text-blue-400 hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </main>
  );
}