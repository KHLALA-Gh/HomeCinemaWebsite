import { Router } from "express";

export const router = Router();

router.get("/api/playlist", (req, res) => {
  let streams: string[] = [];
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
  let names: string[] = [];
  if (typeof req.query.names === "string") {
    names = [req.query.names];
  } else if (req.query.names instanceof Array) {
    names = req.query.names as string[];
  } else {
    res.status(400).json({
      error: "stream names are required",
    });
    return;
  }
  let fileName = req.query.fileName;
  if (!fileName) {
    fileName = "playlist";
  }
  let playlist = "#EXTM3U\n";
  streams.forEach((url, index) => {
    playlist += `#EXTINF:-1,${names[index]}\n${url}\n`;
  });

  // Set response headers
  res.setHeader("Content-Type", "audio/x-mpegurl");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}.m3u"`
  );
  res.send(playlist);
});
