export const INITIAL_CREATOR_SHARE_BPS = 6500;
export const MONETIZATION_QUALIFYING_UPLOADS = 10;
export const MINIMUM_QUALIFYING_DURATION_SECONDS = 7;

export function isQualifyingContent(durationSeconds: number | null | undefined) {
  return typeof durationSeconds === "number" && Number.isInteger(durationSeconds) && durationSeconds > MINIMUM_QUALIFYING_DURATION_SECONDS;
}

export function getMonetizationEligibility(qualifyingPublishedCount: number) {
  if (!Number.isInteger(qualifyingPublishedCount) || qualifyingPublishedCount < 0) {
    throw new Error("Qualifying published count must be a non-negative integer");
  }
  return {
    qualifyingPublishedCount,
    requiredPublishedCount: MONETIZATION_QUALIFYING_UPLOADS,
    eligible: qualifyingPublishedCount >= MONETIZATION_QUALIFYING_UPLOADS,
    remaining: Math.max(0, MONETIZATION_QUALIFYING_UPLOADS - qualifyingPublishedCount),
  };
}

export function calculateInitialCreatorShare(eligibleRevenueCents: number, creatorShareBps = INITIAL_CREATOR_SHARE_BPS) {
  if (!Number.isInteger(eligibleRevenueCents) || eligibleRevenueCents < 0) {
    throw new Error("Eligible revenue must be a non-negative integer number of cents");
  }
  if (!Number.isInteger(creatorShareBps) || creatorShareBps < 0 || creatorShareBps > 10000) {
    throw new Error("Creator share must be between 0 and 10000 basis points");
  }
  return Math.floor((eligibleRevenueCents * creatorShareBps) / 10000);
}

export const INITIAL_EARNINGS_MODEL_NOTICE =
  "Initial model only: once eligible, creators receive 65% of eligible platform revenue. Final payment, deductions, and payout rules are not finalized.";
