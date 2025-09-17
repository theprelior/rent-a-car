// src/server/auth/index.ts

import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth/config";

/**
 * Bu, `getServerSession` için bir sarmalayıcıdır (wrapper).
 * Böylece sunucu tarafındaki her dosyada `authOptions`'ı tekrar tekrar import etmemize gerek kalmaz.
 * T3 Stack'in NextAuth v4 ile kullandığı standart yöntem budur.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => {
  return getServerSession(authOptions);
};