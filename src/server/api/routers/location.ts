// src/server/api/routers/location.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";


export const locationRouter = createTRPCRouter({
  // Tüm lokasyonları getir
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.location.findMany();
  }),

  // Yeni bir lokasyon oluştur (sadece adminler)
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3, "Lokasyon adı en az 3 karakter olmalıdır"),
        address: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.location.create({
        data: {
          name: input.name,
          address: input.address,
        },
      });
    }),

    // YENİ: Lokasyon güncelleyen procedure
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(3, "Lokasyon adı en az 3 karakter olmalıdır."),
    }))
    .mutation(({ ctx, input }) => {
      return ctx.db.location.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

      delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // ÖNEMLİ GÜVENLİK KONTROLÜ
      // Silinmek istenen lokasyona kayıtlı araç olup olmadığını kontrol et
      const carCount = await ctx.db.car.count({
        where: { locationId: input.id },
      });

      if (carCount > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: `Bu lokasyona atanmış ${carCount} adet araç bulunduğu için silemezsiniz. Önce araçları başka bir lokasyona taşıyın.`,
        });
      }

      // Eğer hiç araç yoksa, silme işlemine devam et
      return ctx.db.location.delete({
        where: { id: input.id },
      });
    }),
});