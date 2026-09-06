import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { createChannel, createVideo, getChannelByOwnerId } from "../db";
import { storagePut } from "../storage";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { normalizeHashtags } from "../../shared/videoMetadata";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.post("/api/creator/upload", async (req, res) => {
    try {
      const user = await (await import("./context")).createContext({ req, res } as any).then((ctx) => ctx.user);
      if (!user) { res.status(401).json({ error: "creator login required" }); return; }
      const { fileName, contentType, base64, title, description, hashtags, durationSeconds, width, height } = req.body ?? {};
      if (typeof base64 !== "string" || typeof fileName !== "string" || typeof title !== "string") { res.status(400).json({ error: "fileName, title, and base64 video data are required" }); return; }
      const bytes = Buffer.from(base64, "base64");
      if (!bytes.length || bytes.length > 50 * 1024 * 1024) { res.status(400).json({ error: "Video must be larger than 0 and no more than 50 MB" }); return; }
      let channel = await getChannelByOwnerId(user.id);
      if (!channel) channel = await createChannel(user.id, `creator-${user.id}`, user.name || "Creator", "NEL A VISION creator channel");
      if (!channel) { res.status(500).json({ error: "Could not create creator channel" }); return; }
      const stored = await storagePut(`creator-${user.id}/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`, bytes, contentType || "video/mp4");
      const video = await createVideo(channel.id, title, description, stored.url, undefined, typeof durationSeconds === "number" ? durationSeconds : undefined, typeof width === "number" ? width : undefined, typeof height === "number" ? height : undefined, typeof hashtags === "string" ? normalizeHashtags(hashtags) : undefined);
      res.json({ video, playbackUrl: stored.url, width, height });
    } catch (error) { console.error("[Creator Upload] Failed", error); res.status(500).json({ error: "Upload failed" }); }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
