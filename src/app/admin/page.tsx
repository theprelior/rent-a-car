// app/admin/page.tsx

export default async function AdminDashboardPage() {
  return (
    <div className="flex h-full items-center justify-center rounded-lg bg-gray-800 p-8 text-center text-white">
      <div>
        <h1 className="mb-4 text-4xl font-bold">Admin Paneline Hoş Geldiniz</h1>
        <p className="text-lg text-gray-300">
          Buradan araç ekleyebilir ve düzenleyebilirsiniz.
        </p>
        <p className="mt-2 text-lg text-gray-300">
          Lütfen işlemler için soldaki menüyü kullanın.
        </p>
      </div>
    </div>
  );
}