// app/api/upload/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya bulunamadı." });
  }

  // Gelen dosyayı byte dizisine çeviriyoruz
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Dosyayı sunucudaki public/uploads klasörüne kaydediyoruz
  // Benzersiz bir isim oluşturmak için tarih bilgisini kullanıyoruz
  const filename = `${Date.now()}_${file.name}`;
  const path = join(process.cwd(), "public/uploads", filename);
  
  try {
    await writeFile(path, buffer);
    console.log(`Dosya şuraya kaydedildi: ${path}`);
    
    // Client'a dosyanın public URL'ini gönderiyoruz
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("Dosya yazma hatası:", error);
    return NextResponse.json({ success: false, error: "Dosya kaydedilemedi." });
  }
}