import env from "dotenv";
import fs from "node:fs/promises";
import express, { Express } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ViteDevServer } from "vite";

import { declareRoutes } from "./api/index.js";
import { exec } from "node:child_process";

env.config();

const isProduction = process.env.NODE_ENV === "production";
const base = process.env.BASE || "/";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const defaultServerConf: ServerConfig = {
  openVLC: false,
  desktopMode: false,
  "torrent-streamer-api": {
    external: false,
    origin: "",
  },
};

export async function bootServer(port: number, config?: Partial<ServerConfig>) {
  const templateHtml = isProduction
    ? await fs.readFile(
        path.join(__dirname, "../dist/client/index.html"),
        "utf-8",
      )
    : "";

  const app: Express = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  let vite: ViteDevServer | undefined;

  if (!isProduction) {
    const { createServer } = await import("vite");
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
      base,
    });
    app.use(vite.middlewares);
  } else {
    const compression = (await import("compression")).default;
    const sirv = (await import("sirv")).default;

    app.use(compression());
    app.use(
      base,
      sirv(path.join(__dirname, "../dist/client"), { extensions: [] }),
    );
  }
  const c: ServerConfig = {
    ...defaultServerConf,
    ...config,
  };
  const router = declareRoutes(c);
  app.use(router);

  if (!c["torrent-streamer-api"].external) {
    const streamerRouter = (await import("torrent-streamer-api")).default;
    app.use(
      streamerRouter({
        torrentFilesTimeout: 1000 * 30,
        ipStreamLimit: c.desktopMode ? Infinity : undefined,
      }),
    );
  }

  if (c.openVLC) {
    app.get("/api/play-vlc", async (req, res) => {
      try {
        let streams: string[];
        if (typeof req.query.streams === "string") {
          streams = [req.query.streams];
        } else if (req.query.streams instanceof Array) {
          streams = req.query.streams as string[];
        } else {
          res.status(400).json({
            error: "Stream urls are required",
          });
          return;
        }
        exec(`vlc ${streams.join(" ")}`);
      } catch (err) {
        console.log(err);
      }
    });
  }
  app.use(async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      let template: string;
      let render: (url: string) => Promise<any>;

      if (!isProduction && vite) {
        template = await fs.readFile(
          path.join(__dirname, "../index.html"),
          "utf-8",
        );
        template = await vite.transformIndexHtml(url, template);
        render = (
          await vite.ssrLoadModule(path.join(__dirname, "./entry-server.jsx"))
        ).render;
      } else {
        template = templateHtml;
        //@ts-ignore
        render = (await import("./server/entry-server.js")).render;
      }

      const rendered = await render(url);
      const html = template
        .replace("<!--app-head-->", rendered.head ?? "")
        .replace("<!--app-html-->", rendered.html ?? "");

      res.status(200).set({ "Content-Type": "text/html" }).send(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.stack);
    }
  });

  return new Promise<import("http").Server>((resolve) => {
    const server = app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
      resolve(server);
    });
  });
}
