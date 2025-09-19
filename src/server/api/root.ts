import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { carRouter } from "~/server/api/routers/car"; // <--- 1. ADIM: carRouter'ı import et
import { locationRouter } from "~/server/api/routers/location"; // <-- 1. Import et
import { contactRouter } from "~/server/api/routers/contact"; // <-- 1. Import et
import { bookingRouter } from "~/server/api/routers/booking"; // <-- 1. Import et
import { userRouter } from "~/server/api/routers/user"; // <-- Import et
import { extraRouter } from "./routers/extra"; // <-- 1. Import et

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  //post: postRouter,
  car: carRouter,
  location: locationRouter,
  contact: contactRouter, // <-- 2. Buraya ekle
  booking: bookingRouter, // <-- 2. Buraya ekle
  user: userRouter, // <-- Buraya ekle
  extra: extraRouter, // <-- 2. Buraya ekle

});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
