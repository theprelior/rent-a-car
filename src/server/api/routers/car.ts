// src/server/api/routers/car.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { YakitTuru, VitesTuru, KasaTipi, CekisTipi, Durum, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const carRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        locationId: z.number().int().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional()
    )
    .query(({ ctx, input }) => {
      const whereClause: Prisma.CarWhereInput = {};
      if (input?.locationId) {
        whereClause.locationId = input.locationId;
      }
      if (input?.startDate && input?.endDate) {
        whereClause.bookings = {
          none: {
            AND: [
              { startDate: { lt: input.endDate } },
              { endDate: { gt: input.startDate } },
            ],
          },
        };
      }
      return ctx.db.car.findMany({
        where: whereClause,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.bigint() }))
    .query(async ({ ctx, input }) => {
      const car = await ctx.db.car.findUnique({
        where: { id: input.id },
        include: { location: true },
      });
      if (!car) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return car;
    }),

  create: protectedProcedure
    .input(
      z.object({
        marka: z.string().min(1, "Marka boş olamaz"),
        model: z.string().min(1, "Model boş olamaz"),
        yil: z.number().int().min(1900).max(new Date().getFullYear() + 1),
        yakitTuru: z.nativeEnum(YakitTuru),
        vitesTuru: z.nativeEnum(VitesTuru),
        motorHacmi: z.number().optional(),
        beygirGucu: z.number().int().optional(),
        renk: z.string().optional(),
        kapiSayisi: z.number().int().optional(),
        koltukSayisi: z.number().int().optional(),
        kasaTipi: z.nativeEnum(KasaTipi).optional(),
        cekisTipi: z.nativeEnum(CekisTipi).optional(),
        plaka: z.string().optional(),
        sasiNo: z.string().min(1, "Şasi Numarası zorunludur"),
        fiyat: z.number().optional(),
        kilometre: z.number().int().optional(),
        durum: z.nativeEnum(Durum).optional(),
        donanimPaketi: z.string().optional(),
        ekstraOzellikler: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        locationId: z.number().int().optional(), 
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.car.create({
        data: input,
      });
    }),

  // DÜZELTİLMİŞ UPDATE PROSEDÜRÜ
  update: protectedProcedure
    .input(
      z.object({
        id: z.bigint(), // <-- 1. DÜZELTME: ID alanı eklendi (zorunlu)
        // Diğer tüm alanlar opsiyonel, çünkü sadece bir tanesi bile güncellenebilir
        marka: z.string().min(1).optional(),
        model: z.string().min(1).optional(),
        yil: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
        yakitTuru: z.nativeEnum(YakitTuru).optional(),
        vitesTuru: z.nativeEnum(VitesTuru).optional(),
        motorHacmi: z.number().optional(),
        beygirGucu: z.number().int().optional(),
        renk: z.string().optional(),
        kapiSayisi: z.number().int().optional(),
        koltukSayisi: z.number().int().optional(),
        kasaTipi: z.nativeEnum(KasaTipi).optional(),
        cekisTipi: z.nativeEnum(CekisTipi).optional(),
        plaka: z.string().optional(),
        sasiNo: z.string().min(1).optional(),
        fiyat: z.number().optional(),
        kilometre: z.number().int().optional(),
        durum: z.nativeEnum(Durum).optional(),
        donanimPaketi: z.string().optional(),
        ekstraOzellikler: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        locationId: z.number().int().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...dataToUpdate } = input;
      return ctx.db.car.update({
        where: { id },
        data: dataToUpdate,
      });
    }),
});