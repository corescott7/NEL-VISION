import { describe, expect, it } from "vitest";
import { extractHashtags, getDisplayHashtags, normalizeHashtags, parseHashtags } from "./videoMetadata";

describe("video hashtag metadata", () => {
  it("normalizes comma- and space-separated hashtags", () => {
    expect(normalizeHashtags("#Music, Tutorial  #Shorts")).toBe("#music #tutorial #shorts");
  });

  it("removes unsafe characters, duplicates, and excess tags", () => {
    const source = "#Music #music #creator! " + Array.from({ length: 20 }, (_, index) => `tag${index}`).join(" ");
    const tags = parseHashtags(source);
    expect(tags[0]).toBe("#music");
    expect(tags[1]).toBe("#creator");
    expect(tags).toHaveLength(15);
  });

  it("returns an empty collection when no hashtags are supplied", () => {
    expect(parseHashtags(null)).toEqual([]);
  });

  it("extracts hashtags from legacy titles and descriptions", () => {
    expect(extractHashtags("A creator story #Shorts and #Engineering")).toEqual(["#shorts", "#engineering"]);
    expect(getDisplayHashtags(null, "Legacy upload #Vision")).toEqual(["#vision"]);
    expect(getDisplayHashtags("#saved", "Legacy #fallback")).toEqual(["#saved"]);
  });
});
