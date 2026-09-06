import { normalizeHashtags } from "../shared/videoMetadata";

export type VideoRecordInput = {
  channelId: number;
  title: string;
  description?: string;
  playbackUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  width?: number;
  height?: number;
  hashtags?: string;
};

export function buildVideoRecord(input: VideoRecordInput) {
  return {
    channelId: input.channelId,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    hashtags: input.hashtags ? normalizeHashtags(input.hashtags) : undefined,
    playbackUrl: input.playbackUrl,
    thumbnailUrl: input.thumbnailUrl,
    durationSeconds: input.durationSeconds,
    width: input.width,
    height: input.height,
  };
}
