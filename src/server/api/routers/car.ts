// src/server/api/routers/car.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  adminProcedure
} from "~/server/api/trpc";
import { YakitTuru, VitesTuru, KasaTipi, CekisTipi, Durum, CarCategory, type Prisma, type PricingTier } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const carRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        // Mevcut filtreler
        locationId: z.number().int().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        
        // Yeni filtreler
        searchTerm: z.string().optional(), // Marka/Model araması için
        yakitTuru: z.nativeEnum(YakitTuru).optional(),
        vitesTuru: z.nativeEnum(VitesTuru).optional(),
        category: z.nativeEnum(CarCategory).optional(),
      }).optional()
    )
    .query(({ ctx, input }) => {
      // Prisma için karmaşık bir "where" koşulu oluşturuyoruz
      const whereClause: Prisma.CarWhereInput = {};
      const andConditions: Prisma.CarWhereInput[] = [];

      if (input?.locationId) {
        andConditions.push({ locationId: input.locationId });
      }

      if (input?.startDate && input?.endDate) {
        andConditions.push({
          bookings: {
            none: {
              AND: [
                { startDate: { lt: input.endDate } },
                { endDate: { gt: input.startDate } },
              ],
            },
          },
        });
      }

      if (input?.yakitTuru) {
        andConditions.push({ yakitTuru: input.yakitTuru });
      }

      if (input?.vitesTuru) {
        andConditions.push({ vitesTuru: input.vitesTuru });
      }

      if (input?.category) {
        andConditions.push({ category: input.category });
      }

      // Marka veya modelde arama yapmak için
      if (input?.searchTerm) {
        andConditions.push({
          OR: [
            { marka: { contains: input.searchTerm, mode: 'insensitive' } },
            { model: { contains: input.searchTerm, mode: 'insensitive' } },
          ],
        });
      }
      
      // Tüm koşulları birleştir
      if(andConditions.length > 0) {
        whereClause.AND = andConditions;
      }

      return ctx.db.car.findMany({
        where: whereClause,
        include: {
          pricingTiers: true,
          location: true,
        },
      });
    }),

  getById: publicProcedure
  .input(z.object({ id: z.bigint() }))
  .query(async ({ ctx, input }) => {
    const car = await ctx.db.car.findUnique({
      where: { id: input.id },
      include: {
        location: true,
        pricingTiers: true,
      },
    });

    if (!car) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    // Decimal -> number dönüşümü
    const pricingTiers = car.pricingTiers.map(t => ({
      ...t,
      dailyRate: Number(t.dailyRate),
    }));

    return {
      ...car,
      pricingTiers,
    };
  }),


  create: adminProcedure
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
        bagajSayisi: z.number().int().optional(),
        kasaTipi: z.nativeEnum(KasaTipi).optional(),
        cekisTipi: z.nativeEnum(CekisTipi).optional(),
        plaka: z.string().optional(),
        sasiNo: z.string().min(1, "Şasi Numarası zorunludur"),
        // Fiyat aralıkları için yeni alan
        basePrice: z.number().min(0, "Fiyat negatif olamaz."), // <-- YENİ ALAN

        pricingTiers: z.array(z.object({
          minDays: z.number().int().min(1),
          maxDays: z.number().int().min(1),
          dailyRate: z.number().min(0),
        })).min(1, "En az bir fiyat aralığı eklemelisiniz."),

        kilometre: z.number().int().optional(),
        durum: z.nativeEnum(Durum).optional(),
        donanimPaketi: z.string().optional(),
        ekstraOzellikler: z.array(z.string()).optional(),
        imageUrl: z.string().nullish(), // .optional() yerine .nullish() kullanıyoruz

        locationId: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { pricingTiers, ...carData } = input;

      return ctx.db.car.create({
        data: {
          ...carData,
          pricingTiers: {
            create: pricingTiers, // İlişkili fiyat aralıklarını da aynı anda oluştur
          },
        },
      });
    }),

  // DÜZELTİLMİŞ UPDATE PROSEDÜRÜ
  update: adminProcedure
    .input(
      z.object({
        id: z.bigint(),
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
        bagajSayisi: z.number().int().optional(),
        kasaTipi: z.nativeEnum(KasaTipi).optional(),
        cekisTipi: z.nativeEnum(CekisTipi).optional(),
        plaka: z.string().optional(),
        sasiNo: z.string().min(1).optional(),
        basePrice: z.number().min(0).optional(), // <-- YENİ ALAN (opsiyonel)

        pricingTiers: z.array(z.object({
          minDays: z.number().int().min(1),
          maxDays: z.number().int().min(1),
          dailyRate: z.number().min(0),
        })).optional(),
        kilometre: z.number().int().optional(),
        durum: z.nativeEnum(Durum).optional(),
        donanimPaketi: z.string().optional(),
        ekstraOzellikler: z.array(z.string()).optional(),
        imageUrl: z.string().nullish(),
        locationId: z.number().int().optional(),
         category: z.nativeEnum(CarCategory).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, pricingTiers, ...carData } = input;

      return ctx.db.$transaction(async (prisma) => {
        // 1. Araç bilgilerini güncelle
        await prisma.car.update({
          where: { id },
          data: carData,
        });

        // 2. pricingTiers varsa, eskileri silip yenilerini ekle
        if (pricingTiers) {
          await prisma.pricingTier.deleteMany({
            where: { carId: id },
          });

          await prisma.pricingTier.createMany({
            data: pricingTiers.map((tier) => ({ ...tier, carId: id })),
          });
        }

        // 3. Güncel araç + fiyat aralıklarını geri döndür
        return prisma.car.findUnique({
          where: { id },
          include: {
            pricingTiers: true,
            location: true,
          },
        });
      });
    }),


  // YENİ: ID'ye göre bir aracı silen procedure
  delete: adminProcedure
    .input(z.object({ id: z.bigint() })) // Car ID'si bigint olduğu için
    .mutation(async ({ ctx, input }) => {
      // ÖNEMLİ: Bir aracı silmeden önce, o araca ait aktif
      // bir rezervasyon olup olmadığını kontrol etmek iyi bir fikirdir.
      // Şimdilik bu kontrolü atlayıp direkt silme işlemini yapıyoruz.
      // İstersen daha sonra bu kontrolü ekleyebiliriz.

      const carToDelete = await ctx.db.car.findUnique({
        where: { id: input.id },
      });

      if (!carToDelete) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Silinecek araç bulunamadı.',
        });
      }

      await ctx.db.car.delete({
        where: { id: input.id },
      });

      return { success: true, message: 'Araç başarıyla silindi.' };
    }),
});