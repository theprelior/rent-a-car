"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type AuthFormProps = {
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: () => void; // Başarılı işlemden sonra paneli kapatmak için
};

// Google ikonu için basit bir SVG bileşeni (dosyanın en üstüne ekleyebilirsin)
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.226-11.283-7.581l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.712 34.419 44 28.134 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
  </svg>
);
// --- GİRİŞ FORMU ---
export function LoginForm({ onSwitchMode, onSuccess }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false, // Sayfa yönlendirmesi olmasın, sonucu burada yakalayalım
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      onSuccess(); // Başarılı, paneli kapat
      router.refresh(); // Sayfayı yenileyerek session bilgisini güncelle
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <h2 className="mb-6 text-center text-3xl font-bold text-white">Giriş Yap</h2>
        {/* YENİ BÖLÜM: GOOGLE BUTONU */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          className="flex w-full items-center justify-center gap-3 rounded-md border border-neutral-700 bg-neutral-800 px-3 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          <GoogleIcon />
          <span>Google ile Giriş Yap</span>
        </button>
      </div>

       {/* AYIRICI ÇİZGİ */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-900 px-2 text-neutral-500">Veya</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="rounded-md bg-red-900/50 p-3 text-center text-red-400">{error}</p>}
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-gray-300">E-posta</label>
          <input id="email-login" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-style mt-1" />
        </div>
        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-gray-300">Şifre</label>
          <input id="password-login" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-style mt-1" />
        </div>
        <button type="submit" disabled={isLoading} className="auth-button">
          {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-400">
        Hesabın yok mu?{" "}
        <button onClick={() => onSwitchMode('register')} className="font-semibold text-yellow-400 hover:text-yellow-300">
          Kayıt Ol
        </button>
      </p>
    </div>
  );
}


// --- KAYIT FORMU ---
export function RegisterForm({ onSwitchMode, onSuccess }: AuthFormProps) {
  // DEĞİŞİKLİK 1: State'leri yeni alanlara göre güncelliyoruz
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const registerMutation = api.user.register.useMutation({
    onSuccess: () => {
      alert("Kaydınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
      onSuccess();
      onSwitchMode('login');
    },
    onError: (error) => {
      // Zod refine hatasını da burada yakalayabiliriz
      alert(`Kayıt olurken bir hata oluştu: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // DEĞİŞİKLİK 2: Client-side'da da hızlı bir kontrol yapalım
    if (password !== passwordConfirmation) {
        alert("Şifreler uyuşmuyor!");
        return;
    }
    // DEĞİŞİKLİK 3: Mutation'ı yeni veri yapısıyla çağırıyoruz
    registerMutation.mutate({ firstName, lastName, email, password, passwordConfirmation });
  };
  
  return (
    <div className="w-full">
      <h2 className="mb-6 text-center text-3xl font-bold text-white">Hesap Oluştur</h2>
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Boşluğu 6'dan 4'e düşürdük */}
        
        {/* DEĞİŞİKLİK 4: İsim ve Soyisim için yan yana iki input */}
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="w-full sm:w-1/2">
                <label htmlFor="firstName-register" className="block text-sm font-medium text-gray-300">İsim</label>
                <input id="firstName-register" type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input-style" />
            </div>
            <div className="w-full sm:w-1/2">
                <label htmlFor="lastName-register" className="block text-sm font-medium text-gray-300">Soyisim</label>
                <input id="lastName-register" type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="input-style" />
            </div>
        </div>

        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-300">E-posta</label>
          <input id="email-register" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-style" />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-300">Şifre</label>
          <input id="password-register" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input-style" />
        </div>

        {/* DEĞİŞİKLİK 5: Şifre Tekrarı alanı eklendi */}
        <div>
          <label htmlFor="passwordConfirmation-register" className="block text-sm font-medium text-gray-300">Şifre Tekrar</label>
          <input id="passwordConfirmation-register" type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="input-style" />
        </div>

        <button type="submit" disabled={registerMutation.isPending} className="auth-button pt-4"> {/* Butonun üst boşluğunu artırdık */}
          {registerMutation.isPending ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-400">
        Zaten bir hesabın var mı?{" "}
        <button onClick={() => onSwitchMode('login')} className="font-semibold text-yellow-400 hover:text-yellow-300">
          Giriş Yap
        </button>
      </p>
    </div>
  );
}
