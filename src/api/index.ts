import * as Config from "./routes/config.js";
import * as tvShows from "./routes/tv_shows.js";
import * as playlist from "./routes/streamFiles.js";
import { Router } from "express";

const router = Router();

export function declareRoutes(config: ServerConfig) {
  tvShows.TVShows(router, config);
  tvShows.TVShowsSearch(router, config);

  tvShows.TVShowsDetails(router, config);
  tvShows.TVShowsSeasonDetails(router, config);
  playlist.Playlist(router, config);
  Config.getConfigs(router, config);
  return router;
}
