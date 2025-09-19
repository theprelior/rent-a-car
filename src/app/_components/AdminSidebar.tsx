// app/_components/AdminSidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthStatus } from "./AuthStatus"; // AuthStatus'u import ediyoruz

const navLinks = [
    { name: "Panel", href: "/admin" },
    { name: "Araçlar", href: "/admin/cars" },
    { name: "Yeni Araç Ekle", href: "/admin/cars/add" },
    { name: "Lokasyonlar", href: "/admin/locations" },
    { name: "Kullanıcılar", href: "/admin/users" }, // <-- BU SATIRI EKLE
    { name: "Rezervasyon Yönetimi", href: "/admin/manage-bookings" },
    { name: "Ekstralar", href: "/admin/extras" },  
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        // Sidebar'ı dikey bir flex container yapıyoruz ve tam boy olmasını sağlıyoruz
        <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-gray-800 p-4">
            <div>
                <h2 className="mb-8 text-center text-2xl font-bold text-white">
                    Admin Paneli
                </h2>
                <nav className="flex flex-col space-y-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`rounded-md px-4 py-2 text-lg transition-colors ${isActive
                                        ? "bg-blue-600 text-white"
                                        :"text-gray-300 hover:bg-gray-700 hover:text-white"}`}>
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* mt-auto (margin-top: auto) ile bu bölüm en alta itilir */}
            <div className="mt-auto">
                <AuthStatus />
            </div>
        </aside>
    );
}