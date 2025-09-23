// src/server/api/routers/contact.ts

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { transporter } from "./nodemailerservice";
import { env } from "~/env.js";

export const contactRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "İsim boş olamaz."),
        email: z.string().email("Geçersiz e-posta adresi."),
        message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır."),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Mesajı veritabanına kaydet
      const savedMessage = await ctx.db.contactMessage.create({
        data: {
          name: input.name,
          email: input.email,
          message: input.message,
        },
      });

      // 2. E-posta içeriğini oluştur
      const emailHtml = `
        <h1>Yeni İletişim Formu Mesajı</h1>
        <p><strong>Gönderen:</strong> ${input.name}</p>
        <p><strong>E-posta:</strong> ${input.email}</p>
        <hr>
        <h3>Mesaj:</h3>
        <p>${input.message.replace(/\n/g, "<br>")}</p>
      `;
      const emailText = `Yeni İletişim Formu Mesajı\n\nGönderen: ${input.name}\nE-posta: ${input.email}\n\nMesaj:\n${input.message}`;

      // 3. E-postayı gönder
      await transporter.sendMail({
        from: `"${input.name}" <${env.GMAIL_EMAIL}>`, // Gönderen olarak kullanıcının adı görünür
        to: env.GMAIL_EMAIL, // Kendi e-posta adresinize
        replyTo: input.email, // "Yanıtla" butonuna basınca kullanıcıya gider
        subject: `Yeni Mesaj: ${input.name}`,
        html: emailHtml,
        text: emailText,
      });

      return { success: true, message: "Mesajınız başarıyla gönderildi!" };
    }),
});