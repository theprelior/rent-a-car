// Dosya: src/server/auth.ts

import { type NextAuthOptions, type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/server/db";
import { compare } from "bcryptjs";
import { Role } from "@prisma/client";
import { env } from "~/env.js"; // <-- DÜZELTME BURADA

/**
 * Module augmentation for `next-auth` types.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      role: Role;
      emailVerified: Date | null; // <-- YENİ: emailVerified alanını ekle

    };
  }
  interface User {
    role?: Role | null;
    emailVerified?: Date | null; // <-- YENİ: User tipine de ekle

  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre girmelisiniz.");
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Kullanıcı bulunamadı veya şifre geçersiz.");
        }

        if (!user.emailVerified) {
          throw new Error("Giriş yapmadan önce lütfen e-posta adresinizi doğrulayın.");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("E-posta veya şifre hatalı.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified; // <-- YENİ: JWT'ye ekle
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.emailVerified = token.emailVerified as Date | null; // <-- YENİ: Session'a ekle
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  }
};