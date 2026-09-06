import { describe, expect, it } from "vitest";
import { buildVideoRecord } from "./videoRecord";

describe("persisted video metadata", () => {
  it("includes the creator description and normalized hashtags in the database insert record", () => {
    const record = buildVideoRecord({
      channelId: 22,
      title: "  My first Short  ",
      description: "  A clear creator description.  ",
      hashtags: "#Vision, Creator #Shorts",
      playbackUrl: "/manus-storage/creator/video.mp4",
      durationSeconds: 18,
      width: 1080,
      height: 1920,
    });

    expect(record).toMatchObject({
      channelId: 22,
      title: "My first Short",
      description: "A clear creator description.",
      hashtags: "#vision #creator #shorts",
      playbackUrl: "/manus-storage/creator/video.mp4",
      durationSeconds: 18,
      width: 1080,
      height: 1920,
    });
  });
});
