import { describe, expect, it } from "vitest";
import { calculateInitialCreatorShare, classifyContent, getMonetizationEligibility, INITIAL_CREATOR_SHARE_BPS } from "./earnings";

describe("NEL A VISION monetization model", () => {
  it("applies the initial 65% creator share", () => {
    expect(calculateInitialCreatorShare(10000)).toBe(6500);
    expect(INITIAL_CREATOR_SHARE_BPS).toBe(6500);
  });

  it("requires Shorts to be under 30 seconds and 9:16", () => {
    expect(classifyContent(29, 1080, 1920)).toMatchObject({ type: "short", qualifies: true });
    expect(classifyContent(30, 1080, 1920).qualifies).toBe(false);
    expect(classifyContent(20, 1920, 1080).qualifies).toBe(false);
  });

  it("requires Long videos to be over 30 seconds in any ratio", () => {
    expect(classifyContent(31, 1920, 1080)).toMatchObject({ type: "long", qualifies: true });
    expect(classifyContent(31, 1080, 1920)).toMatchObject({ type: "long", qualifies: true });
  });

  it("opens monetization after 2 qualifying Shorts and 1 qualifying Long", () => {
    expect(getMonetizationEligibility(1, 1)).toMatchObject({ eligible: false, shortsRemaining: 1, longVideosRemaining: 0 });
    expect(getMonetizationEligibility(2, 0)).toMatchObject({ eligible: false, shortsRemaining: 0, longVideosRemaining: 1 });
    expect(getMonetizationEligibility(2, 1)).toMatchObject({ eligible: true, shortsRemaining: 0, longVideosRemaining: 0 });
  });

  it("exposes the stable creator-share basis-point default", () => {
    expect(INITIAL_CREATOR_SHARE_BPS).toBe(6500);
  });
});
