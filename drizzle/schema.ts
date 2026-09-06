import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const channels = mysqlTable("channels", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  handle: varchar("handle", { length: 64 }).notNull().unique(),
  displayName: varchar("displayName", { length: 120 }).notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  bannerUrl: text("bannerUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const videos = mysqlTable("videos", {
  id: int("id").autoincrement().primaryKey(),
  channelId: int("channelId").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  description: text("description"),
  hashtags: text("hashtags"),
  thumbnailUrl: text("thumbnailUrl"),
  playbackUrl: text("playbackUrl"),
  visibility: mysqlEnum("visibility", ["draft", "unlisted", "public"]).default("draft").notNull(),
  durationSeconds: int("durationSeconds"),
  width: int("width"),
  height: int("height"),
  viewCount: int("viewCount").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const channelFollows = mysqlTable("channelFollows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  channelId: int("channelId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const advertiserProfiles = mysqlTable("advertiserProfiles", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  companyName: varchar("companyName", { length: 160 }).notNull(),
  websiteUrl: text("websiteUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const adPlacements = mysqlTable("adPlacements", {
  id: int("id").autoincrement().primaryKey(),
  advertiserId: int("advertiserId").notNull(),
  videoId: int("videoId").notNull(),
  campaignName: varchar("campaignName", { length: 160 }).notNull(),
  status: mysqlEnum("status", ["draft", "requested", "approved", "active", "paused"]).default("draft").notNull(),
  budgetCents: int("budgetCents").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const creatorEarnings = mysqlTable("creatorEarnings", {
  id: int("id").autoincrement().primaryKey(),
  channelId: int("channelId").notNull(),
  eligibleRevenueCents: int("eligibleRevenueCents").default(0).notNull(),
  creatorShareBps: int("creatorShareBps").default(6500).notNull(),
  creatorAmountCents: int("creatorAmountCents").default(0).notNull(),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  status: mysqlEnum("status", ["estimated", "finalized", "paid"]).default("estimated").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Channel = typeof channels.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type CreatorEarning = typeof creatorEarnings.$inferSelect;
export type AdvertiserProfile = typeof advertiserProfiles.$inferSelect;
export type AdPlacement = typeof adPlacements.$inferSelect;
