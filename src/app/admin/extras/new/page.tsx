import { ExtraForm } from "~/app/_components/ExtraForm";

export default function NewExtraPage() {
  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Yeni Ekstra Hizmet Ekle</h1>
      <ExtraForm />
    </div>
  );
}