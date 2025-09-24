"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Shield, ShieldOff, Trash2, UserPlus } from "lucide-react"; // İkonlar
import { useAlert } from '~/context/AlertContext'; // Hook'u import et

export default function AdminUsersPage() {
  const { data: session } = useSession(); // Mevcut adminin kim olduğunu bilmek için
  const utils = api.useUtils();
  const { showAlert } = useAlert(); // Hook'u çağır

  const { data: users, isLoading, error } = api.user.getAll.useQuery();

  const updateUserRole = api.user.updateUserRole.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate(); // Başarı sonrası listeyi yenile
    },
    onError: (error) => {
      showAlert(`Hata: ${error.message}`);
    },
  });

  const deleteUser = api.user.deleteUser.useMutation({
    onSuccess: () => {
      showAlert("Kullanıcı başarıyla silindi.");
      utils.user.getAll.invalidate(); // Başarı sonrası listeyi yenile
    },
    onError: (error) => {
      showAlert(`Hata: ${error.message}`);
    },
  });

  const handleRoleChange = (userId: string, currentRole: Role | null) => {
    const newRole = currentRole === Role.ADMIN ? Role.USER : Role.ADMIN;
    const actionText = newRole === Role.ADMIN ? "admin yapmak istediğinizden" : "admin yetkisini kaldırmak istediğinizden";
    if (window.confirm(`Bu kullanıcıyı ${actionText} emin misiniz?`)) {
      updateUserRole.mutate({ userId, role: newRole });
    }
  };

  const handleDelete = (userId: string) => {
    if (window.confirm("Bu kullanıcıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      deleteUser.mutate({ userId });
    }
  };

  if (isLoading) return <div className="text-white p-6">Kullanıcılar yükleniyor...</div>;
  if (error) return <div className="text-red-500 p-6">Hata: {error.message}</div>;

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Kayıtlı Kullanıcılar</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">İsim</th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">E-posta</th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Rol</th>
              <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700/50">
                <td className="px-4 py-3 whitespace-nowrap">{user.name ?? 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.role === Role.ADMIN ? (
                    <span className="inline-flex items-center rounded-full bg-green-500/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
                      <Shield size={14} className="mr-1.5" />
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-500/20 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                      Kullanıcı
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/bookings/new?userId=${user.id}&userName=${user.name}`} className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
                      <UserPlus size={16} /> Rez. Oluştur
                    </Link>
                    {/* Admin kendi kendini düzenleyemez/silemez */}
                    {session?.user.id !== user.id && (
                      <>
                        <button onClick={() => handleRoleChange(user.id, user.role)} className="flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors">
                          {user.role === Role.ADMIN ? <><ShieldOff size={16} /> Yetkiyi Al</> : <><Shield size={16} /> Admin Yap</>}
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="flex items-center gap-1.5 text-red-500 hover:text-red-400 transition-colors">
                          <Trash2 size={16} /> Sil
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

