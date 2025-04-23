import env from "dotenv";

import fs from "node:fs/promises";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import routes from "./api/index.js";
import configs from "../home_cinema_config.json" with{type : "json"}


env.config();

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || (isProduction ? 4173 : 5173);
const base = process.env.BASE || "/";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite: any;
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
  //@ts-ignore
  app.use(compression());
  app.use(base, sirv(path.join(__dirname, "./client"), { extensions: [] }));
}

if (configs["torrent-streamer-api"].external === false){
  let streamerRouter = (await import("torrent-streamer-api")).default
  app.use(streamerRouter({
    torrentFilesTimeout : 1000 * 30,
  }))
}

// Set all routers
Object.keys(routes).map((k) => {
  //@ts-ignore
  app.use(routes[k]);
});

// Serve HTML
app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.js').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile(path.join("./index.html"), "utf-8");
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
      .replace(`<!--app-head-->`, rendered.head ?? "")
      .replace(`<!--app-html-->`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e: any) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
