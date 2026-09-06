import { describe, expect, it } from "vitest";
import { sanitizeReturnTo } from "./const";

describe("OAuth return routing", () => {
  it("allows internal creator and advertiser destinations", () => {
    expect(sanitizeReturnTo("/studio")).toBe("/studio");
    expect(sanitizeReturnTo("/advertiser")).toBe("/advertiser");
  });

  it("rejects external and protocol-relative destinations", () => {
    expect(sanitizeReturnTo("https://example.com")).toBe("/");
    expect(sanitizeReturnTo("//example.com")).toBe("/");
    expect(sanitizeReturnTo(undefined)).toBe("/");
  });
});
