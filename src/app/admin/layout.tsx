// app/admin/layout.tsx

import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { AdminSidebar } from "../_components/AdminSidebar"; // Birazdan oluşturacağız

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Bu layout'un altındaki tüm sayfalar için session kontrolü yapıyoruz.
  const session = await getServerAuthSession();
  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sol Dikey Menü (Sidebar) */}
      <AdminSidebar />

      {/* Sağ İçerik Alanı */}
      <main className="flex-grow p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
}