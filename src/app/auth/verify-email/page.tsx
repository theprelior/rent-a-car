"use client";


import VerifyEmailClient from './VerifyEmailClient';

export const dynamic = 'force-dynamic';

// app/auth/verify-email/page.tsx
export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-md rounded-lg bg-neutral-900 p-8 text-center shadow-lg">
        <VerifyEmailClient />
      </div>
    </main>
  );
}
