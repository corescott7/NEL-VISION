import { describe, expect, it } from "vitest";
import { calculateInitialCreatorShare, INITIAL_CREATOR_SHARE_BPS } from "./earnings";

describe("calculateInitialCreatorShare", () => {
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
});
