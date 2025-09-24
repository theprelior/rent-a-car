"use client";

import { Role, type User } from "@prisma/client";
import { api } from "~/trpc/react";
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

// İkonları bu dosyaya da taşıyalım
const IconUser = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconMail = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const IconShield = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>);


type UserInfoCardProps = {
  user: User; // User tipini Prisma'dan alacağız
};

export function UserInfoCard({ user }: UserInfoCardProps) {
    const { showAlert } = useAlert(); // Hook'u çağır

  const resendMutation = api.user.resendVerificationEmail.useMutation({
    onSuccess: (data) => {
      showAlert(data.message);
    },
    onError: (error) => {
      showAlert(`Bir hata oluştu: ${error.message}`);
    }
  });

  return (
    <div className="rounded-xl bg-neutral-900 p-6 border border-yellow-500/20 shadow-lg">
      <h2 className="text-2xl font-bold border-b border-neutral-700 pb-4 mb-6">Kişisel Bilgiler</h2>
      <div className="space-y-5 text-lg">
        <div className="flex items-center gap-4">
          <IconUser /> <span>{user.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <IconMail /> <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-4">
          <IconShield />
          <div className="flex items-center gap-2">
            <span>{user.role === Role.ADMIN ? "Yönetici Hesabı" : "Standart Kullanıcı"}</span>
            {user.role === Role.ADMIN && <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">ADMIN</span>}
          </div>
        </div>
        
        {user.emailVerified ? (
            <span className="inline-block rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">E-posta Doğrulandı</span>
        ) : (
          <div className="flex items-center gap-4 pt-2">
            <span className="inline-block rounded-full bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-400">E-posta Doğrulanmamış</span>
            <button 
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending}
              className="rounded-md bg-yellow-500 px-3 py-1 text-sm font-bold text-black transition hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendMutation.isPending ? "Gönderiliyor..." : "Doğrula"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}