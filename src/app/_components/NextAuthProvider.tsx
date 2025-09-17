// app/_components/NextAuthProvider.tsx

"use client"; // Bu bileşenin Client Component olduğunu belirtiyoruz.

import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};