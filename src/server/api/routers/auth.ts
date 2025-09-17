// src/server/api/routers/auth.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      // GÜNCELLEME: Zod şemasını yeni alanlarla genişletiyoruz
      z.object({
        name: z.string().min(2, "İsim en az 2 karakter olmalıdır."),
        lastName: z.string().min(2, "Soyisim en az 2 karakter olmalıdır."),
        email: z.string().email("Geçersiz e-posta adresi."),
        password: z.string().min(6, "Şifre en az 6 karakter olmalıdır."),
        passwordConfirmation: z.string().min(6),
      })
      // .refine() ile iki şifre alanının eşleşip eşleşmediğini kontrol ediyoruz
      .refine((data) => data.password === data.passwordConfirmation, {
        message: "Şifreler uyuşmuyor.",
        path: ["passwordConfirmation"], // Hatanın hangi alana ait olduğunu belirtiyoruz
      })
    )
    .mutation(async ({ input }) => {
      const supabase = createClient(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      );

      // Supabase'e gönderilecek veriyi hazırlıyoruz
      const { error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          // İsim ve soyisimi Supabase'in metadata alanına kaydediyoruz
          data: {
            full_name: `${input.name} ${input.lastName}`,
          },
        },
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return { success: true, message: "Kayıt başarılı! Lütfen e-postanızı doğrulayın." };
    }),
});