import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { countChannelFollowers, createChannel, createVideo, followChannel, getChannelByHandle, getPublicVideo, getStudioMetricsForOwner, listChannelVideos, listOwnerVideos, listPublicVideos, listRelatedVideos, publishVideo, publishVideoForOwner } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query(opts => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  discovery: router({ search: publicProcedure.input(z.object({ query: z.string().optional() }).optional()).query(({ input }) => listPublicVideos(input?.query)) }),
  channels: router({ byHandle: publicProcedure.input(z.object({ handle: z.string().min(1) })).query(async ({ input }) => { const channel = await getChannelByHandle(input.handle); if (!channel) return null; return { channel, videos: await listChannelVideos(channel.id), followers: await countChannelFollowers(channel.id) }; }), create: protectedProcedure.input(z.object({ handle: z.string().min(2).max(64), displayName: z.string().min(1).max(120), bio: z.string().max(500).optional() })).mutation(({ ctx, input }) => createChannel(ctx.user.id, input.handle, input.displayName, input.bio)), follow: protectedProcedure.input(z.object({ channelId: z.number().int().positive() })).mutation(({ ctx, input }) => followChannel(ctx.user.id, input.channelId)) }),
  videos: router({ byId: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { const video = await getPublicVideo(input.id); return video ? { video, related: await listRelatedVideos(video.channelId, video.id) } : null; }), create: protectedProcedure.input(z.object({ channelId: z.number().int().positive(), title: z.string().min(1).max(180), description: z.string().optional(), playbackUrl: z.string().url().optional(), thumbnailUrl: z.string().url().optional() })).mutation(({ input }) => createVideo(input.channelId, input.title, input.description, input.playbackUrl, input.thumbnailUrl)), publish: protectedProcedure.input(z.object({ videoId: z.number().int().positive(), channelId: z.number().int().positive() })).mutation(({ input }) => publishVideo(input.videoId, input.channelId)) }),
  studio: router({ metrics: protectedProcedure.query(({ ctx }) => getStudioMetricsForOwner(ctx.user.id)), videos: protectedProcedure.query(({ ctx }) => listOwnerVideos(ctx.user.id)), publish: protectedProcedure.input(z.object({ videoId: z.number().int().positive() })).mutation(({ ctx, input }) => publishVideoForOwner(input.videoId, ctx.user.id)) }),
});
export type AppRouter = typeof appRouter;
