// src/server/auth/config.ts

import { type NextAuthOptions, type DefaultSession } from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

// GÜNCELLEME 1: TypeScript tiplerine 'role' alanını ekliyoruz.
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string; // Session'daki user objesine rolü ekle
    } & DefaultSession["user"];
  }

  interface User {
    role?: string; // NextAuth User objesine de rolü ekle
  }
}

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    secret: env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gerekli.");
        }
        const supabase = createClient(
          env.NEXT_PUBLIC_SUPABASE_URL,
          env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error(error?.message || "Giriş başarısız.");
        }

        // GÜNCELLEME 2: authorize fonksiyonundan rol bilgisini de döndür.
        return {
          id: data.user.id,
          email: data.user.email,
          role: data.user.app_metadata?.role, // Supabase'den gelen rolü al
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  
  // GÜNCELLEME 3: Callback'leri rolü işleyecek şekilde güncelle.
  callbacks: {
    // JWT oluşturulurken bu fonksiyon çalışır
    jwt({ token, user }) {
      if (user) {
        // Giriş anında user objesinden gelen rolü token'a ekle
        token.role = user.role;
      }
      return token;
    },
    // Session'a erişildiğinde bu fonksiyon çalışır
    session({ session, token }) {
      if (session.user) {
        // Token'daki rolü ve id'yi client'a gidecek olan session objesine ekle
        session.user.role = token.role as string;
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};