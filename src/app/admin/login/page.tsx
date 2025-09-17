// app/login/page.tsx

"use client"; // Form interaktif olduğu için bu da bir Client Component olmalı.

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // App Router'da 'next/navigation' kullanılır!

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.ok) {
            // YÖNLENDİRME ADRESİNİ GÜNCELLE
            router.push("/admin");
        } else {
            setError(result?.error ?? "Bir hata oluştu.");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-800 text-white">
            <div className="w-full max-w-xs rounded-lg bg-gray-900 p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold">Admin Paneli Girişi</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="mb-2 block text-sm font-bold" htmlFor="email">
                            E-posta
                        </label>
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border border-gray-700 bg-gray-800 px-3 py-2 leading-tight text-white shadow focus:outline-none"
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-bold" htmlFor="password">
                            Şifre
                        </label>
                        <input
                            className="focus:shadow-outline w-full appearance-none rounded border border-gray-700 bg-gray-800 px-3 py-2 leading-tight text-white shadow focus:outline-none"
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            className="focus:shadow-outline w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                            type="submit"
                        >
                            Giriş Yap
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}