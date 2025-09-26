// app/api/upload/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { writeFile, chmod } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: "Dosya bulunamadı." });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Güvenli dosya adı oluşturma (Bu kısım aynı kalıyor, zaten doğru)
  const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  const safeName = originalNameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const filename = `${Date.now()}-${safeName}${extension}`;
  
  // --- DEĞİŞİKLİK BURADA ---
  // Eski yol: const path = join(process.cwd(), "public/uploads", filename);
  // Yeni yol: Dosyayı proje dışındaki mutlak yola kaydediyoruz.
  const path = join('/var/www/uploads', filename);
  // -------------------------
  
  try {
    // Dosyayı sunucuya yazıyoruz
    await writeFile(path, buffer);

    // Dosya izinlerini ayarlama (Bu kısım aynı kalıyor, zaten doğru)
    await chmod(path, 0o644); 
    
    console.log(`Dosya şuraya kaydedildi: ${path}`);
    
    // URL yolu değişmiyor çünkü Nginx yönlendirmesi bunu hallediyor.
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("Dosya yazma hatası:", error);
    return NextResponse.json({ success: false, error: "Dosya kaydedilemedi." });
  }
}
