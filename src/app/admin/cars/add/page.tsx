// app/admin/cars/add/page.tsx

import { AddCarForm } from "~/app/_components/AddCarForm";

export default function AddCarPage() {
    return (
        <div>
            <h1 className="mb-6 text-3xl font-bold text-white">Yeni Araç Ekle</h1>
            <AddCarForm />
        </div>
    );
}