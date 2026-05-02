import { Router } from "express";
import { TMDBApi, TMDBError } from "../../lib/tmdb_api";
import { HandlerTMDBApiErr } from "./tv_shows";

export function trendingMovies(router: Router) {
  router.get("/api/movies/trending", async (req, res) => {
    try {
      const page = req.query.page;
      const time = req.query.time;
      if (!(typeof time === "string" && (time === "day" || time === "week"))) {
        res.status(400).json({ err: "time must be day or week" });
        return;
      }
      if (typeof page !== "string") {
        res.status(400).json({ err: "page must be a string starting from 1" });
        return;
      }
      const api = new TMDBApi(process.env.TMDB_KEY as string);
      const data = await api.trendingMovies(time, page);
      res.status(200).json(data);
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: "server error" });
    }
  });
}

export function MovieDetails(router: Router) {
  router.get("/api/movies/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const api = new TMDBApi(process.env.TMDB_KEY as string);
      const data = await api.getMovieDetails(id);
      const ext_ids = await api.getMovieExternalIDs(id);
      data.imdb_id = ext_ids.imdb_id;
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof TMDBError) {
        console.log(TMDBError.format(err));
        res.status(err.statusCode || 500).json({
          error: err.message,
        });
        return;
      }

      console.log("Internal Server Error !! : ", err);
      res.status(500).json({
        error: "internal server error",
      });
    }
  });
}

export function MovieSearch(router: Router) {
  router.get("/api/movies/search", async (req, res) => {
    try {
      const query = req.query.query;
      let page = +req.query.page!;
      if (typeof query !== "string") {
        res.status(400).json({
          error: "search query is required",
        });
        return;
      }
      if (!page) {
        page = 1;
      }
      const api = new TMDBApi(process.env.TMDB_KEY as string);
      const data = await api.searchMovies(query, page.toString());
      res.status(200).json(data);
    } catch (err) {
      if (err instanceof TMDBError) {
        return HandlerTMDBApiErr(res, err);
      }
      res.status(500).json({
        error: "Internal Server Error",
      });
    }
  });
}
