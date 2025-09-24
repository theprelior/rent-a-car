import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
  protectedProcedure
} from "~/server/api/trpc";
import { hash } from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { env } from "~/env";

// Gerekli importları ekliyoruz
import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import { VerificationEmail } from "../../../components/VerificationEmail";
import React from "react"; // eklemeyi unutma
import { transporter } from "./nodemailerservice";
import { Role } from "@prisma/client"; 

const createVerificationEmailHtml = ({ userName, verificationLink }: { userName: string, verificationLink: string }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #cccccc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background-color: #1a1a1a; border: 1px solid #333; border-radius: 8px; overflow: hidden; }
      .header { background-color: #1a1a1a; padding: 20px; text-align: center; }
      .header h1 { color: #f5b50a; margin: 0; }
      .content { padding: 30px; }
      .content p { line-height: 1.6; }
      .button { display: block; width: 200px; margin: 20px auto; padding: 15px; background-color: #f5b50a; color: #000000; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold; }
      .link { color: #f5b50a; word-break: break-all; }
      .footer { font-size: 12px; color: #888888; text-align: center; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>Hesabını Doğrula</h1></div>
      <div class="content">
        <p>Merhaba ${userName},</p>
        <p>RENTORA'ya kaydolduğun için teşekkürler. Hesabını doğrulamak ve kullanmaya başlamak için lütfen aşağıdaki butona tıkla.</p>
        <a href="${verificationLink}" style="
          display: block;
          width: 200px;
          margin: 20px auto;
          padding: 15px;
          background-color: #f5b50a;
          color: #000000;
          text-align: center;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        ">
          E-postamı Doğrula
        </a>
        <p>Eğer bu butona tıklayamıyorsan, aşağıdaki linki kopyalayıp tarayıcına yapıştırabilirsin:</p>
        <a href="${verificationLink}" class="link">${verificationLink}</a>
      </div>
      <div class="footer">
        <p>Bu e-postayı sen istemediysen, lütfen dikkate alma.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

// Nodemailer transporter'ını oluşturuyoruz


export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "İsim boş olamaz"),
        lastName: z.string().min(1, "Soyisim boş olamaz"),
        email: z.string().email("Geçersiz e-posta adresi"),
        password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
        passwordConfirmation: z.string(),
      })
        .refine((data) => data.password === data.passwordConfirmation, {
          message: "Şifreler uyuşmuyor.",
          path: ["passwordConfirmation"],
        })
    )
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, password } = input;
      const name = `${firstName} ${lastName}`;

      const existingUser = await ctx.db.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Bu e-posta adresi zaten kullanılıyor.",
        });
      }

      const hashedPassword = await hash(password, 12);
      const user = await ctx.db.user.create({
        data: { name, email, password: hashedPassword },
      });

      // ---------- BU BÖLÜM KODUNDA EKSİKTİ ----------
      // 1. Benzersiz bir token oluştur
      const verificationToken = randomUUID();
      const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 saat geçerli

      // 2. Token'ı veritabanına kaydet
      await ctx.db.verificationToken.create({
        data: {
          identifier: user.email!,
          token: verificationToken,
          expires,
        },
      });

      // 3. Doğrulama linkini oluştur
      const verificationLink = `${env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

      // React bileşenini HTML'e çevirirken işlemin bitmesini bekle (await)
      const emailHtml = createVerificationEmailHtml({ userName: user.name!, verificationLink });
      // --------------------------

      // E-postayı gönder
      try {
        await transporter.sendMail({
          from: `RENTORA <${env.GMAIL_EMAIL}>`,
          to: user.email!,
          subject: 'RENTORA Hesabınızı Doğrulayın',
          html: emailHtml, // Artık burası tamamlanmış bir HTML string'i
        });
      } catch (error) {
        console.error("Nodemailer e-posta gönderim hatası:", error);
        // Bu hatayı fırlatmak, frontend'in sorundan haberdar olmasını sağlar
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Doğrulama e-postası gönderilemedi.',
          cause: error,
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }),

  // SADECE ADMİNLERİN ERİŞEBİLECEĞİ ENDPOINT'LER (Bu kısımlar doğruydu)
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: { id: input.id },
      });
    }),

  // E-POSTA DOĞRULAMA ENDPOINT'İ (Bu kısım da doğruydu)
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      const verificationToken = await ctx.db.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken || verificationToken.expires < new Date()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Geçersiz veya süresi dolmuş doğrulama linki." });
      }

      const userEmail = verificationToken.identifier;

      await ctx.db.$transaction([
        ctx.db.user.update({
          where: { email: userEmail },
          data: { emailVerified: new Date() },
        }),
        ctx.db.verificationToken.delete({
          where: { token },
        }),
      ]);

      return { success: true, message: "E-posta başarıyla doğrulandı!" };
    }),

  getMe: protectedProcedure.query(({ ctx }) => {
    // Session'daki kullanıcı ID'sini kullanarak veritabanından tam kullanıcı verisini çek
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
  // YENİ: Doğrulama e-postasını yeniden gönderen procedure
  resendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
    const { id, email, name, emailVerified } = ctx.session.user;

    // Eğer kullanıcı zaten doğrulanmışsa, işlem yapma
    if (emailVerified) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'E-posta adresiniz zaten doğrulanmış.',
      });
    }

    // Eski token'ları temizle (isteğe bağlı ama iyi bir pratik)
    await ctx.db.verificationToken.deleteMany({
      where: { identifier: email! },
    });

    // --- Bu kısım register fonksiyonundakiyle neredeyse aynı ---
    const verificationToken = randomUUID();
    const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

    await ctx.db.verificationToken.create({
      data: {
        identifier: email!,
        token: verificationToken,
        expires,
      },
    });

    const verificationLink = `${env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

    const emailHtml = createVerificationEmailHtml({ userName: name!, verificationLink });


    try {
      await transporter.sendMail({
        from: `RENTORA <${env.GMAIL_EMAIL}>`,
        to: email!,
        subject: 'RENTORA Hesabınızı Doğrulayın (Yeniden Gönderim)',
        html: emailHtml,
      });
    } catch (error) {
      console.error("Yeniden gönderim hatası:", error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Doğrulama e-postası gönderilemedi.',
      });
    }

    return { success: true, message: "Doğrulama e-postası tekrar gönderildi." };
  }),


  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Bir adminin kendi rolünü değiştirmesini engelle
      if (ctx.session.user.id === input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Kendi rolünüzü değiştiremezsiniz.',
        });
      }
      return ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  // YENİ: Kullanıcı silen procedure
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Bir adminin kendi hesabını silmesini engelle
      if (ctx.session.user.id === input.userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Kendi hesabınızı silemezsiniz.',
        });
      }
      return ctx.db.user.delete({
        where: { id: input.userId },
      });
    }),
});