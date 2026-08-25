export const INITIAL_CREATOR_SHARE_BPS = 6500;

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
  "Initial model only: creator share applies to eligible platform revenue. Final payment, eligibility, deductions, and payout rules are not finalized.";
