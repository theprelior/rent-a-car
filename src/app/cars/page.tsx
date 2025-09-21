
import { api } from "~/trpc/server";
import { CarListingClient } from "./CarListingClient";

export default async function AraclarPage() {
  // Sayfa ilk yüklendiğinde lokasyon listesini sunucuda çekip client'a yolluyoruz.
  const initialLocations = await api.location.getAll();
  
  return (
    <CarListingClient initialLocations={initialLocations} />
  );
}