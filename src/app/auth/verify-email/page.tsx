// app/auth/verify-email/page.tsx dosyasının geçici içeriği

import { cookies } from 'next/headers'

// Bu sayfa dinamik olduğu için bir export default async function olamaz
export default function VerifyEmailPage() {
  // Bu fonksiyonu çağırmak, Next.js'e bu sayfanın dinamik olduğunu anlatır.
  cookies() 
  
  return (
    <div>
      <h1>Doğrulama Test Sayfası</h1>
      <p>Eğer bu sayfayı görüyorsan, build başarılı oldu demektir.</p>
    </div>
  )
}