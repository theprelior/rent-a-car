import { api } from "~/trpc/server";
import { ExtraForm } from "~/app/_components/ExtraForm";

type EditExtraPageProps = {
  params: {
    id: string;
  };
};

export default async function EditExtraPage({ params }: EditExtraPageProps) {
  const extraId = Number(params.id);
  const extra = await api.extra.getById({ id: extraId });

  return (
    <div className="rounded-lg bg-gray-800 p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">Ekstra Hizmeti Düzenle</h1>
      <ExtraForm initialData={extra} />
    </div>
  );
}