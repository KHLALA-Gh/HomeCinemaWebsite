import { bootServer } from "./serverBoot.js";
import env from "dotenv";
env.config();
let PORT = 5173;

if (process.env.NODE_ENV === "production") {
  PORT = 4173;
}
bootServer(PORT, {
  openVLC: true,
  desktopMode: true,
  "torrent-streamer-api": {
    external: true,
    origin: "http://localhost:8081",
  },
});
