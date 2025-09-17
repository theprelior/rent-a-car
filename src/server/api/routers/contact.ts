// src/server/api/routers/contact.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
        email: z.string().email("Geçersiz e-posta adresi"),
        subject: z.string().optional(),
        message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır"),
      })
    )
    .mutation(({ ctx, input }) => {
      // Gelen mesajı veritabanına kaydet
      return ctx.db.contactMessage.create({
        data: input,
      });
    }),
});