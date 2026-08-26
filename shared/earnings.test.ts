import { describe, expect, it } from "vitest";
import {
  calculateInitialCreatorShare,
  getMonetizationEligibility,
  INITIAL_CREATOR_SHARE_BPS,
  isQualifyingContent,
} from "./earnings";

describe("NEL A VISION monetization model", () => {
  it("applies the initial 65% creator share", () => {
    expect(calculateInitialCreatorShare(10000)).toBe(6500);
    expect(INITIAL_CREATOR_SHARE_BPS).toBe(6500);
  });

  it("rounds down fractional cents safely", () => {
    expect(calculateInitialCreatorShare(101)).toBe(65);
  });

  it("rejects invalid revenue and share inputs", () => {
    expect(() => calculateInitialCreatorShare(-1)).toThrow();
    expect(() => calculateInitialCreatorShare(100, 10001)).toThrow();
  });

  it("requires content to be longer than 7 seconds", () => {
    expect(isQualifyingContent(7)).toBe(false);
    expect(isQualifyingContent(7.1)).toBe(false);
    expect(isQualifyingContent(8)).toBe(true);
    expect(isQualifyingContent(null)).toBe(false);
  });

  it("opens monetization after the first 10 qualifying published uploads", () => {
    expect(getMonetizationEligibility(9)).toMatchObject({ eligible: false, remaining: 1 });
    expect(getMonetizationEligibility(10)).toMatchObject({ eligible: true, remaining: 0 });
    expect(getMonetizationEligibility(12)).toMatchObject({ eligible: true, remaining: 0 });
  });
});
