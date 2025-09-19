
//app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { AdminSidebar } from "../_components/AdminSidebar";
import { Role } from "@prisma/client"; // <-- 1. ADIM: Role enum'ını import et

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

if (!session || session.user?.role !== Role.ADMIN) {
  redirect("/"); // VEYA redirect("/");
}

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-grow p-6 sm:p-8 bg-gray-900">
        {/* Opsiyonel: admin panel için üstte boş bir çizgi olmasın diye padding ayarları */}
        <div className="w-full min-h-screen">{children}</div>
      </main>
    </div>
  );
}