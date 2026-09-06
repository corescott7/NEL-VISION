import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { channels, videos } from "../drizzle/schema";
import { getDb } from "./db";
import { buildVideoRecord } from "./videoRecord";

describe("video metadata database persistence", () => {
  it("writes and reads the creator description and normalized hashtags in one rolled-back transaction", async () => {
    const db = await getDb();
    if (!db) return;

    let persisted: { description: string | null; hashtags: string | null } | undefined;
    try {
      await db.transaction(async (tx) => {
        const channelResult = await tx.insert(channels).values({
          ownerId: 2147480000,
          handle: `metadata-test-${Date.now()}`,
          displayName: "Metadata Test Creator",
        });
        const channelId = Number(channelResult[0].insertId);
        const videoResult = await tx.insert(videos).values(buildVideoRecord({
          channelId,
          title: "Persistence Test Short",
          description: "Description saved through the real video table.",
          hashtags: "#Vision Creator #Shorts",
          playbackUrl: "/manus-storage/test-video.mp4",
          durationSeconds: 15,
          width: 1080,
          height: 1920,
        }));
        const videoId = Number(videoResult[0].insertId);
        const rows = await tx.select({ description: videos.description, hashtags: videos.hashtags }).from(videos).where(eq(videos.id, videoId)).limit(1);
        persisted = rows[0];
        tx.rollback();
      });
    } catch {
      // Drizzle throws intentionally when tx.rollback() is called.
    }

    expect(persisted).toEqual({
      description: "Description saved through the real video table.",
      hashtags: "#vision #creator #shorts",
    });
  });
});
