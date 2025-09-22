import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const bookingRouter = createTRPCRouter({
  // Kullanıcının kendi rezervasyonlarını getirmesi için (profil sayfasında kullanılıyor)
  getMyBookings: protectedProcedure.query(({ ctx }) => {
    return ctx.db.booking.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        car: true, // Rezervasyonla birlikte araç bilgilerini de getir
      },
      orderBy: {
        startDate: 'desc', // En yeni rezervasyon üstte olsun
      }
    });
  }),

  // YENİ: ID'ye göre bir rezervasyonu silen procedure
  delete: adminProcedure
    .input(z.object({ id: z.number() })) // Booking ID'si integer olduğu için z.number()
    .mutation(async ({ ctx, input }) => {
      // Önce rezervasyonun var olup olmadığını kontrol edelim
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
      });

      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Silinecek rezervasyon bulunamadı.',
        });
      }

      await ctx.db.booking.delete({
        where: { id: input.id },
      });

      return { success: true, message: 'Rezervasyon başarıyla silindi.' };
    }),


  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: { user: true, car: true }, // Kullanıcı ve Araç bilgilerini de al
      });
      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Rezervasyon bulunamadı.',
        });
      }
      return booking;
    }),
  // YENİ: Tüm rezervasyonları getiren procedure
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.booking.findMany({
      // Rezervasyonla birlikte ilişkili kullanıcı ve araç bilgilerini de getiriyoruz
      include: {
        user: true,
        car: true,
      },
      // En yeni rezervasyonlar en üstte görünsün
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  // YENİ: Adminin bir kullanıcı adına rezervasyon oluşturması için
    createByAdmin: adminProcedure
    .input(
      z.object({
        // DÜZELTME: userId'yi opsiyonel yapıyoruz
        userId: z.string().optional(), 
        carId: z.bigint(),
        startDate: z.date(),
        endDate: z.date(),
        guestName: z.string().optional(),
        guestPhone: z.string().optional(),
        guestEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.userId && !input.guestName) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Rezervasyon için bir üye seçilmeli veya misafir adı girilmelidir.',
        });
      }

      const overlappingBookings = await ctx.db.booking.count({
        where: {
          carId: input.carId,
          AND: [
            { startDate: { lt: input.endDate } },
            { endDate: { gt: input.startDate } },
          ],
        },
      });

      if (overlappingBookings > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Seçilen araç bu tarihler arasında zaten rezerve edilmiş.',
        });
      }

      const newBooking = await ctx.db.booking.create({
        data: {
          userId: input.userId,
          carId: input.carId,
          startDate: input.startDate,
          endDate: input.endDate,
          guestName: input.guestName,
          guestPhone: input.guestPhone,
          guestEmail: input.guestEmail,
        },
      });

      return newBooking;
    }),

  // YENİ: ID'ye göre bir rezervasyonu güncelleyen procedure
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      carId: z.bigint(),
      startDate: z.date(),
      endDate: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Güncelleme sırasında, düzenlenmekte olan bu rezervasyon HARİÇ,
      // başka bir rezervasyonla çakışma olup olmadığını kontrol et.
      const overlappingBookings = await ctx.db.booking.count({
        where: {
          id: { not: input.id }, // Mevcut rezervasyonu hariç tut
          carId: input.carId,
          AND: [
            { startDate: { lt: input.endDate } },
            { endDate: { gt: input.startDate } },
          ],
        },
      });

      if (overlappingBookings > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Seçilen araç bu yeni tarihler arasında başka bir müşteri için rezerve edilmiş.',
        });
      }

      const updatedBooking = await ctx.db.booking.update({
        where: { id: input.id },
        data: {
          carId: input.carId,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });

      return updatedBooking;
    }),
});