import { bootServer } from "./serverBoot.js";
import env from "dotenv";
env.config();
let PORT = 5173;

if (process.env.NODE_ENV === "production") {
  PORT = 4173;
}
bootServer(PORT, {
  version: {
    name: "Alpha 7",
    semVer: "0.0.7",
  },
  desktopMode: true,
});
