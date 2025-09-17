// src/server/api/routers/user.ts

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Tüm kullanıcıları getir (sadece adminler erişebilir)
  getAll: protectedProcedure
    .query(({ ctx }) => {
        // Rol kontrolünü burada da yapabiliriz
        if (ctx.session.user.role !== 'admin') {
            throw new Error("Yetkisiz erişim");
        }
        return ctx.db.user.findMany();
    }),
    
  // ID'ye göre tek bir kullanıcı getir (sadece adminler)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
        if (ctx.session.user.role !== 'admin') {
            throw new Error("Yetkisiz erişim");
        }
        return ctx.db.user.findUnique({
            where: { id: input.id },
        });
    }),
});