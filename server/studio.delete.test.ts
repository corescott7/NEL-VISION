import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("studio.delete", () => {
  it("rejects unauthenticated deletion attempts", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.studio.delete({ videoId: 1 })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("does not report deletion when the authenticated owner has no matching video", async () => {
    const caller = appRouter.createCaller({
      user: {
        id: 999999,
        openId: "creator-with-no-library",
        name: "Creator",
        email: null,
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {} as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.studio.delete({ videoId: 987654321 })).resolves.toBe(false);
  });
});
