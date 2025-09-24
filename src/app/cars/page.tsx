
import { api } from "~/trpc/server";
import { CarListingClient } from "./CarListingClient";
import { type Metadata } from "next";


export const metadata: Metadata = {
  title: "Araç Kiralama | RENTORA",
};


export default async function AraclarPage() {
  // Sayfa ilk yüklendiğinde lokasyon listesini sunucuda çekip client'a yolluyoruz.
  const initialLocations = await api.location.getAll();
  
  return (
    <CarListingClient initialLocations={initialLocations} />
  );
}