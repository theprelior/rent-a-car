//server/api/routers/extra.ts

import { z } from "zod";
import { createTRPCRouter, adminProcedure,publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const extraRouter = createTRPCRouter({
  // Tüm ekstraları getiren procedure
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.extra.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  // ID'ye göre tek bir ekstra getiren procedure
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const extra = await ctx.db.extra.findUnique({
        where: { id: input.id },
      });
      if (!extra) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Ekstra bulunamadı.' });
      }
      return extra;
    }),

  // Yeni bir ekstra oluşturan procedure
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(3, "İsim en az 3 karakter olmalıdır."),
        description: z.string().optional(),
        price: z.number().min(0, "Fiyat negatif olamaz."),
        isDaily: z.boolean(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.extra.create({
        data: input,
      });
    }),

  // Mevcut bir ekstrayı güncelleyen procedure
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(3).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        isDaily: z.boolean().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...dataToUpdate } = input;
      return ctx.db.extra.update({
        where: { id },
        data: dataToUpdate,
      });
    }),

  // Bir ekstrayı silen procedure
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.extra.delete({
        where: { id: input.id },
      });
    }),


     getAllPublic: publicProcedure.query(({ ctx }) => {
    return ctx.db.extra.findMany({
      orderBy: { price: 'asc' }, // Fiyata göre sırala
    });
  }),
});