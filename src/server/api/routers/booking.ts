// src/server/api/routers/booking.ts
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const bookingRouter = createTRPCRouter({
  // Sadece giriş yapmış kullanıcının kendi rezervasyonlarını getirir
  getMyBookings: protectedProcedure.query(({ ctx }) => {
    return ctx.db.booking.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      // Rezervasyonla birlikte araba bilgilerini de getirmek için 'include' kullanıyoruz
      include: {
        car: true, 
      },
      orderBy: {
        startDate: 'desc', // En yeni rezervasyonlar en üstte olsun
      }
    });
  }),
  // YENİ MUTATION
  createByAdmin: protectedProcedure
    .input(z.object({
        userId: z.string(),
        carId: z.bigint(),
        startDate: z.date(),
        endDate: z.date(),
    }))
    .mutation(({ ctx, input }) => {
        if (ctx.session.user.role !== 'admin') {
            throw new Error("Yetkisiz erişim");
        }
        return ctx.db.booking.create({
            data: {
                userId: input.userId,
                carId: input.carId,
                startDate: input.startDate,
                endDate: input.endDate,
            }
        });
    }),
});