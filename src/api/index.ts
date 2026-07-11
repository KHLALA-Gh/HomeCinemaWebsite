import * as Config from "./routes/config.js";
import * as tvShows from "./routes/tv_shows.js";
import * as playlist from "./routes/streamFiles.js";
import * as movies from "./routes/movies.js";
import { Router } from "express";

const router = Router();

export function declareRoutes(config: ServerConfig) {
  movies.trendingMovies(router);
  movies.MovieSearch(router);
  movies.MovieDetails(router);
  tvShows.TVShows(router, config);
  tvShows.TVShowsSearch(router, config);
  tvShows.TVShowExtIDS(router, config);
  tvShows.TVShowsDetails(router, config);
  tvShows.TVShowsSeasonDetails(router, config);
  playlist.Playlist(router, config);
  Config.getConfigs(router, config);
  return router;
}
