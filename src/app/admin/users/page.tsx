// app/admin/users/page.tsx

import Link from "next/link";
import { api } from "~/trpc/server";

export default async function AdminUsersPage() {
  const users = await api.user.getAll();

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Kayıtlı Kullanıcılar</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">E-posta</th>
              <th className="px-4 py-2 text-left">İsim</th>
              <th className="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-600">
                <td className="px-4 py-2 truncate max-w-xs">{user.id}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.name ?? 'N/A'}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/bookings/new?userId=${user.id}`}
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Rezervasyon Oluştur
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}