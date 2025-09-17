// src/server/api/routers/location.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const locationRouter = createTRPCRouter({
  // Tüm lokasyonları getir
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.location.findMany();
  }),

  // Yeni bir lokasyon oluştur (sadece adminler)
  create: protectedProcedure
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
});