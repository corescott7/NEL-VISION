export const INITIAL_CREATOR_SHARE_BPS = 6500;
export const REQUIRED_SHORTS = 2;
export const REQUIRED_LONG_VIDEOS = 1;

export type MonetizationProgress = {
  shortsCount: number;
  longVideosCount: number;
  eligible: boolean;
  shortsRemaining: number;
  longVideosRemaining: number;
};

export function classifyContent(durationSeconds: number, width: number, height: number) {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || width <= 0 || height <= 0) {
    throw new Error("Duration and dimensions are required");
  }
  const ratio = width / height;
  if (durationSeconds < 30) {
    return { type: "short" as const, qualifies: width * 16 === height * 9, aspectRatio: ratio };
  }
  if (durationSeconds > 30) {
    return { type: "long" as const, qualifies: true, aspectRatio: ratio };
  }
  return { type: "ineligible" as const, qualifies: false, aspectRatio: ratio };
}

export function getMonetizationEligibility(shortsCount: number, longVideosCount: number): MonetizationProgress {
  if (![shortsCount, longVideosCount].every((value) => Number.isInteger(value) && value >= 0)) {
    throw new Error("Content counts must be non-negative integers");
  }
  return {
    shortsCount,
    longVideosCount,
    eligible: shortsCount >= REQUIRED_SHORTS && longVideosCount >= REQUIRED_LONG_VIDEOS,
    shortsRemaining: Math.max(0, REQUIRED_SHORTS - shortsCount),
    longVideosRemaining: Math.max(0, REQUIRED_LONG_VIDEOS - longVideosCount),
  };
}

export function calculateInitialCreatorShare(eligibleRevenueCents: number, creatorShareBps = INITIAL_CREATOR_SHARE_BPS) {
  if (!Number.isInteger(eligibleRevenueCents) || eligibleRevenueCents < 0) throw new Error("Eligible revenue must be a non-negative integer number of cents");
  if (!Number.isInteger(creatorShareBps) || creatorShareBps < 0 || creatorShareBps > 10000) throw new Error("Creator share must be between 0 and 10000 basis points");
  return Math.floor((eligibleRevenueCents * creatorShareBps) / 10000);
}

export const INITIAL_EARNINGS_MODEL_NOTICE =
  "Initial model only: after 2 qualifying Shorts and 1 qualifying Long video, creators receive 65% of eligible platform revenue. Final payment, deductions, and payout rules are not finalized.";
