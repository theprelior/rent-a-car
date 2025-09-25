// app/api/upload/route.ts

import { type NextRequest, NextResponse } from "next/server";
// --- DEĞİŞİKLİK 1: 'chmod' fonksiyonunu import ediyoruz ---
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

  // --- DEĞİŞİKLİK 2: Güvenli dosya adı oluşturma ---
  // Orijinal dosya adını ve uzantısını ayırıyoruz
  const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  
  // Dosya adını temizliyoruz (boşlukları -> tire, küçük harf, geçersiz karakterleri sil)
  const safeName = originalNameWithoutExt
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  
  // Benzersiz ve temiz bir dosya adı oluşturuyoruz
  const filename = `${Date.now()}-${safeName}${extension}`;
  // --------------------------------------------------------

  const path = join(process.cwd(), "public/uploads", filename);
  
  try {
    // Dosyayı sunucuya yazıyoruz
    await writeFile(path, buffer);

    // --- DEĞİŞİKLİK 3: Dosya izinlerini ayarlama (Kalıcı Çözüm) ---
    // Bu satır, dosyanın Nginx tarafından okunabilmesini garanti eder.
    await chmod(path, 0o644); 
    // ---------------------------------------------------------------
    
    console.log(`Dosya şuraya kaydedildi: ${path}`);
    
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("Dosya yazma hatası:", error);
    return NextResponse.json({ success: false, error: "Dosya kaydedilemedi." });
  }
}