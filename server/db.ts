import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { channels, channelFollows, creatorEarnings, InsertUser, users, videos } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; } }
  return _db;
}
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; } else { values.lastSignedIn = new Date(); updateSet.lastSignedIn = new Date(); }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }
export async function listPublicVideos(search?: string) { const db = await getDb(); if (!db) return []; const rows = await db.select().from(videos).where(eq(videos.visibility, "public")).orderBy(desc(videos.publishedAt)); return search?.trim() ? rows.filter((row) => row.title.toLowerCase().includes(search.toLowerCase())) : rows; }
export async function getChannelByHandle(handle: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(channels).where(eq(channels.handle, handle)).limit(1); return result[0]; }
export async function listChannelVideos(channelId: number) { const db = await getDb(); if (!db) return []; return db.select().from(videos).where(and(eq(videos.channelId, channelId), eq(videos.visibility, "public"))).orderBy(desc(videos.publishedAt)); }
export async function getPublicVideo(id: number) { const db = await getDb(); if (!db) return undefined; const rows = await db.select().from(videos).where(and(eq(videos.id, id), eq(videos.visibility, "public"))).limit(1); return rows[0]; }
export async function listRelatedVideos(channelId: number, excludeId: number) { const db = await getDb(); if (!db) return []; return db.select().from(videos).where(and(eq(videos.channelId, channelId), eq(videos.visibility, "public"))).orderBy(desc(videos.publishedAt)).limit(6); }
export async function countChannelFollowers(channelId: number) { const db = await getDb(); if (!db) return 0; const result = await db.select({ count: sql<number>`count(*)` }).from(channelFollows).where(eq(channelFollows.channelId, channelId)); return Number(result[0]?.count ?? 0); }
export async function followChannel(userId: number, channelId: number) { const db = await getDb(); if (!db) return; const existing = await db.select().from(channelFollows).where(and(eq(channelFollows.userId, userId), eq(channelFollows.channelId, channelId))).limit(1); if (!existing[0]) await db.insert(channelFollows).values({ userId, channelId }); }
export async function createChannel(ownerId: number, handle: string, displayName: string, bio?: string) { const db = await getDb(); if (!db) return undefined; await db.insert(channels).values({ ownerId, handle, displayName, bio }); return getChannelByHandle(handle); }
export async function createVideo(channelId: number, title: string, description?: string, playbackUrl?: string, thumbnailUrl?: string) { const db = await getDb(); if (!db) return undefined; const result = await db.insert(videos).values({ channelId, title, description, playbackUrl, thumbnailUrl }); const id = Number(result[0].insertId); const rows = await db.select().from(videos).where(eq(videos.id, id)).limit(1); return rows[0]; }
export async function publishVideo(videoId: number, channelId: number) { const db = await getDb(); if (!db) return undefined; await db.update(videos).set({ visibility: "public", publishedAt: new Date() }).where(and(eq(videos.id, videoId), eq(videos.channelId, channelId))); const rows = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1); return rows[0]; }
export async function getStudioMetrics(channelId: number) { const db = await getDb(); if (!db) return { views: 0, videos: 0, followers: 0, earningsCents: 0 }; const [videoRows, followerCount, earningsRows] = await Promise.all([db.select({ viewCount: videos.viewCount }).from(videos).where(eq(videos.channelId, channelId)), countChannelFollowers(channelId), db.select({ amount: creatorEarnings.creatorAmountCents }).from(creatorEarnings).where(eq(creatorEarnings.channelId, channelId))]); return { views: videoRows.reduce((sum, row) => sum + row.viewCount, 0), videos: videoRows.length, followers: followerCount, earningsCents: earningsRows.reduce((sum, row) => sum + row.amount, 0) }; }
