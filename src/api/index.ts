import { Router } from "express";
import { router as Config } from "./routes/config.js";
import { router as tvShows } from "./routes/tv_shows.js";

const router = Router();

router.get("/api", (_, res) => {
  res.sendStatus(204);
});
export default { Config, tvShows, router };
